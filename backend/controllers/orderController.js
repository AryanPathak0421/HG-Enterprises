const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');

// Create a new order
const Settings = require('../models/Settings');

exports.createOrder = async (req, res) => {
    try {
        const { items, address, shippingAddress, paymentMethod, paymentStatus } = req.body;

        const globalSettings = await Settings.findOne() || { gstPercentage: 18, shippingCharge: 50 };
        const gstRate = globalSettings.gstPercentage / 100;

        // Check if first order for the user
        const previousOrders = await Order.countDocuments({ userId: req.user.id });
        const isFirstOrder = previousOrders === 0;
        const shippingAmount = isFirstOrder ? 0 : (globalSettings.shippingCharge || 50);

        // Support both address and shippingAddress keys
        const orderAddress = address || shippingAddress;

        if (!orderAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        // Validate items and calculate subtotal
        let calculatedSubtotal = 0;
        const validatedItems = items.map(item => {
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            calculatedSubtotal += price * quantity;

            return {
                id: item._id || item.id,
                brand: item.brand || 'HG Enterprises',
                name: item.name || 'Product',
                category: item.category || 'General',
                subcategory: item.subcategory || '',
                image: item.image || (item.images && item.images[0]) || '',
                price: price,
                quantity: quantity,
                variant: item.variant || item.size || 'Default',
                unit: item.unit || 'pcs'
            };
        });

        const gstAmount = Math.round(calculatedSubtotal * gstRate);
        const total = calculatedSubtotal + gstAmount + shippingAmount;

        const newOrder = {
            userId: req.user.id,
            orderId: 'ORD-' + Date.now(),
            items: validatedItems,
            subtotal: calculatedSubtotal,
            gstAmount: gstAmount,
            shippingAmount: shippingAmount,
            total: total,
            address: orderAddress,
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: paymentStatus || 'Pending',
            status: 'Processing'
        };

        const order = await Order.create(newOrder);

        // Deduct stock and log movements
        for (const item of validatedItems) {
            const product = await Product.findById(item.id);
            if (product) {
                const oldStock = product.variants?.[0]?.stock || 0;
                const newStock = oldStock - item.quantity;

                // Update product stock
                await Product.findByIdAndUpdate(item.id, {
                    $inc: { "variants.0.stock": -item.quantity }
                });

                // Create log
                await InventoryLog.create({
                    productId: item.id,
                    change: -item.quantity,
                    oldStock,
                    newStock,
                    reason: `Order Fulfilled #${order.orderId}`
                });
            }
        }

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('[ORDER ERROR]', error);
        res.status(500).json({
            message: 'Failed to place order',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get orders for a specific user
exports.getUserOrders = async (req, res) => {
    try {
        console.log(`[ORDER FETCH] Fetching for User ID: ${req.user.id}`);
        const orders = await Order.find({ userId: req.user.id }).populate('userId', 'name email phone').sort({ createdAt: -1 });
        console.log(`[ORDER FETCH] Found ${orders.length} orders`);
        res.status(200).json(orders);
    } catch (error) {
        console.error('[ORDER FETCH ERROR]', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        console.log(`[ADMIN ORDER FETCH] Fetching all orders...`);
        const orders = await Order.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
        console.log(`[ADMIN ORDER FETCH] Found ${orders.length} total orders`);
        res.status(200).json(orders);
    } catch (error) {
        console.error('[ADMIN ORDER FETCH ERROR]', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order', error: error.message });
    }
};
