const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

router.post('/', authMiddleware, returnController.createReturnRequest);
router.get('/my', authMiddleware, returnController.getUserReturns);
router.get('/', authMiddleware, adminMiddleware, returnController.getAllReturns);
router.get('/:id', authMiddleware, returnController.getReturnById);
router.patch('/:id', authMiddleware, adminMiddleware, returnController.updateReturnStatus);

// Image Upload Protocol for returns (Users can upload)
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        res.status(200).json({ imageUrl: req.file.path });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
