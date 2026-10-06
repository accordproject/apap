import type { RequestHeaders } from '@a2a-js/sdk/server';
import { AuthAdapter, DevelopmentPrincipal, Principal } from './types';

/** Explicitly insecure adapter available only for local development and tests. */
export class NoneAdapter implements AuthAdapter {
    public readonly name = 'none';
    public readonly securitySchemeName: undefined = undefined;

    public async authenticate(_headers: RequestHeaders): Promise<Principal> {
        return new DevelopmentPrincipal();
    }

    public describeScheme(): undefined {
        return undefined;
    }
}
