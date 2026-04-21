const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// All products
router.get('/', productController.getAllProducts);

// Packs
router.get('/packs', productController.getAllPacks);

// Single product
router.get('/:id', productController.getProductById);

// Admin Routes (Protected)
const { adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, adminMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);
router.patch('/:id/status', authMiddleware, adminMiddleware, productController.toggleProductStatus);
router.patch('/admin/inventory/bulk-adjust', authMiddleware, adminMiddleware, productController.bulkAdjustStock);
router.get('/admin/inventory/logs', authMiddleware, adminMiddleware, productController.getAllInventoryLogs);

// Reviews
router.get('/reviews/my', authMiddleware, reviewController.getMyReviews);
router.get('/:productId/reviews', reviewController.getProductReviews);
router.post('/reviews', authMiddleware, reviewController.addReview);
router.delete('/reviews/:id', authMiddleware, reviewController.deleteReview);

// Admin Review Routes
router.get('/admin/reviews/all', authMiddleware, adminMiddleware, reviewController.getAllReviewsAdmin);
router.patch('/admin/reviews/:id/status', authMiddleware, adminMiddleware, reviewController.updateReviewStatus);

module.exports = router;
