const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    id: { type: String }, // Optional
    brand: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    variant: { type: String },
    unit: { type: String }
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    shippingAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Received', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'], default: 'Processing' },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    address: { type: Object, required: true },
    trackingId: { type: String },
    estimatedDelivery: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
