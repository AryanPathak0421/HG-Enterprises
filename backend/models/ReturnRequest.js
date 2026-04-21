const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['return', 'exchange'], required: true },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    reason: { type: String, required: true },
    comment: { type: String },
    evidence: {
        images: [{ type: String }], // Cloudinary URLs
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Picked Up', 'Received', 'Refunded', 'Replaced', 'Rejected'],
        default: 'Pending'
    },
    adminComment: { type: String },
    refundAmount: { type: Number },
    courier: {
        partner: String,
        awb: String,
        status: String
    },
    timeline: [{
        status: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
