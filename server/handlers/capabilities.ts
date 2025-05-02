import express, { Request, Response } from 'express'

const router = express.Router();

router.use('/', function (req, res) {
    res.json(['TEMPLATE_MANAGE', 'AGREEMENT_MANAGE', 'SHARED_MODEL_MANAGE'])
});

export default router;