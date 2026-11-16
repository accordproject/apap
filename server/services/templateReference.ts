import { eq } from 'drizzle-orm';
import type { DatabaseTransaction } from '../db/client';
import { Template } from '../db/schema';
import { TemplateNotFoundError } from './errors';

const RESOURCE_PREFIX = 'resource:';
const TEMPLATE_RELATIONSHIP_PREFIX = RESOURCE_PREFIX + 'org.accordproject.protocol@1.0.0.Template#';
const BARE_TEMPLATE_SCHEME = /^(?:https?|ap):\/\//;

// Decode the Concerto relationship layer once, preserving URI escapes in
// relationship identifiers stored with encodeURI or encodeURIComponent.
export function templateUriFromReference<T extends string | null | undefined>(reference: T): T | string {
    if (!reference || !reference.startsWith(RESOURCE_PREFIX)) return reference;
    const identifier = reference.split('#').slice(1).join('#');
    try {
        return decodeURIComponent(identifier);
    } catch {
        // A literal '%' that is not an escape: the identifier was never encoded.
        return identifier;
    }
}

function encodeTemplateRelationship(uri: string): string {
    return TEMPLATE_RELATIONSHIP_PREFIX + encodeURIComponent(uri);
}

export function normalizeAgreementTemplateReference(reference: string): string {
    return BARE_TEMPLATE_SCHEME.test(reference) ? encodeTemplateRelationship(reference) : reference;
}

export function templateReferenceSpellings(uri: string): string[] {
    return [
        uri,
        TEMPLATE_RELATIONSHIP_PREFIX + uri,
        encodeTemplateRelationship(uri),
        TEMPLATE_RELATIONSHIP_PREFIX + encodeURI(uri),
    ].filter(reference => templateUriFromReference(reference) === uri);
}

// Match historical relationships that decode once to this exact URI, even if
// they used mixed or lowercase escapes. A literal percent in the target must
// be encoded as %25. The exact spellings handle undecodable raw identifiers.
export function encodedTemplateRelationshipPattern(uri: string): string {
    const identifier = Array.from(uri, character => {
        const encoded = Buffer.from(character).toString('hex').replace(/[\da-f]{2}/g, byte =>
            '%' + byte.replace(/[a-f]/g, letter => `[${letter}${letter.toUpperCase()}]`));
        if (character === '%') return encoded;
        const literal = character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return `(?:${literal}|${encoded})`;
    }).join('');
    return `^${RESOURCE_PREFIX}[^#]*#${identifier}$`;
}

function canDeferTemplate(uri: string): boolean {
    if (/\s|%(?![\da-f]{2})/i.test(uri)) return false;
    const parsed = URL.canParse(uri) ? new URL(uri) : undefined;
    return !!parsed && parsed.protocol.length > 2 && !!(parsed.host || parsed.pathname) && !['ap:', 'http:', 'https:', 'resource:', 'apap:'].includes(parsed.protocol);
}

export async function lockTemplateReference(
    tx: DatabaseTransaction,
    reference: string | null | undefined,
    hash?: string | null,
): Promise<void> {
    const uri = templateUriFromReference(reference);
    if (hash) {
        const rows = await tx.select({ id: Template.id }).from(Template)
            .where(eq(Template.hash, hash)).for('key share').limit(1);
        if (rows.length === 0) throw new TemplateNotFoundError(hash, 422);
        return;
    }
    if (uri == null) return;

    const where = eq(Template.uri, uri);
    if (canDeferTemplate(uri)) {
        // An external URI may already belong to a local row. Observe that row
        // before taking the lock so a concurrent delete cannot turn it into a
        // deferred reference when the locking SELECT wakes up.
        const [existing] = await tx.select({ id: Template.id }).from(Template).where(where).limit(1);
        if (!existing) return;
        const locked = await tx.select({ id: Template.id }).from(Template)
            .where(eq(Template.id, existing.id)).for('key share').limit(1);
        if (locked.length === 0) throw new TemplateNotFoundError(uri, 422);
        return;
    }

    const rows = await tx.select({ id: Template.id }).from(Template).where(where).for('key share').limit(1);
    if (rows.length === 0) throw new TemplateNotFoundError(uri, 422);
}
