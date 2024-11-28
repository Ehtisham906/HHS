const express = require('express');
const processServiceRequest  = require('../controllers/order.controller.js');
const verifyToken = require('../utils/verifyUser.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const router = express.Router();
router.post('/test', (req, res) => {
    res.json({
        message: "API Route Is working"
    })
});
router.post('/service-form', verifyToken, upload.array('files', 10), processServiceRequest);



module.exports = router;
