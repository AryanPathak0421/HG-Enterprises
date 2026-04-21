const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// User Route
router.get('/', bannerController.getAllBanners);

// Admin Routes
router.get('/all', authMiddleware, adminMiddleware, bannerController.getAllBannersAdmin);
router.post('/', authMiddleware, adminMiddleware, bannerController.createBanner);
router.put('/:id', authMiddleware, adminMiddleware, bannerController.updateBanner);
router.delete('/:id', authMiddleware, adminMiddleware, bannerController.deleteBanner);

// Image Upload Endpoint
router.post('/upload', authMiddleware, adminMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        res.status(200).json({ imageUrl: req.file.path });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;

