import express from 'express'

const router = express.Router();

router.get('/', function (req, res) {
    res.json(['TEMPLATE_MANAGE', 
        'SHARED_MODEL_MANAGE', 
        'AGREEMENT_MANAGE', 
        'AGREEMENT_CONVERT_HTML', 'AGREEMENT_TRIGGER'])
});

export default router;