const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: String },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
});

const specificationSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
});

const faqSchema = new mongoose.Schema({
    q: { type: String, required: true },
    a: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true, default: 'HG JEWELS' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    rating: { type: Number, default: 0 },
    tag: { type: String },
    image: { type: String }, // Cloudinary URL
    unit: { type: String, default: 'pcs' },
    description: { type: String },
    benefits: [{ type: String }],
    specifications: [specificationSchema],
    faqs: [faqSchema],
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
