const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

module.exports = router;
