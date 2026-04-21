const Review = require('../models/Review');
const Order = require('../models/Order');
const Pack = require('../models/Pack');
const Product = require('../models/Product');

exports.addReview = async (req, res) => {
    try {
        const { productId, rating, comment, images } = req.body;
        const userId = req.user.id;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) return res.status(400).json({ message: 'You have already reviewed this product' });

        // Check if it's a verified purchase
        const order = await Order.findOne({
            userId,
            "items.id": productId,
            status: 'Delivered'
        });

        const review = await Review.create({
            userId,
            productId,
            rating,
            comment,
            images,
            isVerifiedPurchase: !!order,
            status: 'Pending', // Moderation required
            isVisible: false     // Hidden until approved
        });

        res.status(201).json({ message: 'Review submitted for moderation', review });
    } catch (error) {
        console.error('[ADD REVIEW ERROR]', error);
        res.status(400).json({ message: 'Failed to add review', error: error.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        // Only show approved and visible reviews to users
        const reviews = await Review.find({
            productId: req.params.productId,
            status: 'Approved',
            isVisible: true
        })
            .populate('userId', 'name userImage')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};

exports.getAllReviewsAdmin = async (req, res) => {
    try {
        // Fetch base reviews sorted by chronology
        const reviews = await Review.find()
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        const enrichedReviews = await Promise.all(reviews.map(async (r) => {
            const reviewObj = r.toObject();
            const rawProductId = r.productId; // The raw ID is available here since we didn't populate it

            // Tier 1: Standard Product Audit
            let catalogItem = await Product.findById(rawProductId).select('name');

            // Tier 2: Pack/Bundle Fallback
            if (!catalogItem) {
                catalogItem = await Pack.findById(rawProductId).select('name');
            }

            if (catalogItem) {
                reviewObj.productId = {
                    _id: catalogItem._id,
                    name: catalogItem.name
                };
            } else {
                // If the item exists in neither archive, provide the raw identity for forensic tracing
                reviewObj.productId = {
                    _id: rawProductId,
                    name: `Archived Item (${rawProductId.toString().slice(-6)})`
                };
            }
            return reviewObj;
        }));

        res.status(200).json(enrichedReviews);
    } catch (error) {
        console.error('[GET ALL REVIEWS ADMIN ERROR]', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};

exports.updateReviewStatus = async (req, res) => {
    try {
        const { status, isVisible } = req.body;
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status, isVisible },
            { new: true }
        );
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update review', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete review', error: error.message });
    }
};

exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user.id });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your reviews', error: error.message });
    }
};
