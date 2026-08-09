import express from 'express';
import { buildServerLegalContext, resolvePublicBaseUrl } from '../services/lcpService';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * The Legal Context Protocol (legalcontextprotocol.org v1.0) discovery
 * document, RFC 8615 well-known URI. LCP defines exactly one of these per
 * origin with a REQUIRED `terms` field. APAP is a multi-tenant registry, not
 * a service transacting under its own terms, so there is no agreement-
 * neutral value that honestly fills `terms` — this route only responds when
 * a deployer has explicitly configured a server-level document (see
 * lcpService.buildServerLegalContext), and 404s otherwise. Per-agreement
 * documents are always available at /agreements/:id/legal-context
 * regardless of this configuration.
 */
router.get('/.well-known/legal-context.json', asyncHandler(async function (req, res) {
    const baseUrl = resolvePublicBaseUrl({ requestProtocol: req.protocol, requestHost: req.get('host') });
    const legalContext = await buildServerLegalContext(res.locals.db, baseUrl);
    if (!legalContext) {
        res.status(404).json({ error: 'No server-level Legal Context Protocol document is configured' });
        return;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(legalContext);
}));

export default router;
