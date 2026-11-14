import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * Server capabilities defined in org.accordproject.protocol@1.0.0.Capabilities
 */
export const SERVER_CAPABILITIES = {
    $class: 'org.accordproject.protocol@1.0.0.Capabilities',
    features: [
        'TEMPLATE_MANAGE',
        'SHARED_MODEL_MANAGE',
        'AGREEMENT_MANAGE',
        'AGREEMENT_CONVERT_HTML',
        'AGREEMENT_TRIGGER',
        'AGREEMENT_LEGAL_CONTEXT',
    ],
} as const;

/**
 * GET /capabilities
 * Returns the supported capabilities of the APAP server adhering to the
 * Concerto Capabilities concept schema and OpenAPI specification.
 */
router.get('/', function (req: Request, res: Response) {
    res.json(SERVER_CAPABILITIES);
});

export default router;
