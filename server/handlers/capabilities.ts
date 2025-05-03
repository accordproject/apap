import express from 'express'

const router = express.Router();

router.use('/', function (req, res) {
    res.json(['TEMPLATE_MANAGE', 'AGREEMENT_MANAGE', 'SHARED_MODEL_MANAGE', "AGREEMENT_CONVERT_HTML"])
});

export default router;