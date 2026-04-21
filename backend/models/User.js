const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    id: { type: String }, // Optional, can use mongo's _id
    name: { type: String, required: true },
    type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    houseNo: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    userImage: { type: String },
    points: { type: Number, default: 0 },
    usedCoupons: [{ type: String }],
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    notifications: [{
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ['order', 'offer', 'account'], default: 'account' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
