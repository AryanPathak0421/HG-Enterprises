const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');

// Create a new return/exchange request
exports.createReturnRequest = async (req, res) => {
    try {
        const { orderId, type, items, reason, comment, images } = req.body;

        const newRequest = new ReturnRequest({
            orderId,
            userId: req.user.id,
            type,
            items,
            reason,
            comment,
            evidence: {
                images: images || []
            },
            timeline: [{ status: 'Return Requested' }]
        });

        await newRequest.save();
        res.status(201).json({ message: 'Return request submitted successfully', request: newRequest });
    } catch (error) {
        console.error('[RETURN REQUEST ERROR]', error);
        res.status(500).json({ message: 'Failed to submit return request', error: error.message });
    }
};

// Get user's return requests
exports.getUserReturns = async (req, res) => {
    try {
        const returns = await ReturnRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch return requests', error: error.message });
    }
};

// Admin: Get all return requests
exports.getAllReturns = async (req, res) => {
    try {
        const type = req.query.type; // filter by 'return' or 'exchange'
        const filter = type ? { type } : {};
        const returns = await ReturnRequest.find(filter).populate('userId', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all return requests', error: error.message });
    }
};

// Get return request by ID
exports.getReturnById = async (req, res) => {
    try {
        const ret = await ReturnRequest.findById(req.params.id).populate('userId', 'name email phone');
        if (!ret) return res.status(404).json({ message: 'Return request not found' });
        res.status(200).json(ret);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch return details', error: error.message });
    }
};

// Update return status (Admin)
exports.updateReturnStatus = async (req, res) => {
    try {
        const { status, adminComment, refundAmount } = req.body;
        const updateData = { status, adminComment };
        if (refundAmount) updateData.refundAmount = refundAmount;

        const ret = await ReturnRequest.findByIdAndUpdate(
            req.params.id,
            {
                $set: updateData,
                $push: { timeline: { status } }
            },
            { new: true }
        );

        if (!ret) return res.status(404).json({ message: 'Return request not found' });
        res.status(200).json(ret);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update return status', error: error.message });
    }
};
