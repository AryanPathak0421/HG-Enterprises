const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { applyWatermark } = require('../utils/watermark');

router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Apply brand watermark (logo and gold text)
        const watermarkedBuffer = await applyWatermark(req.file.buffer);

        // Stream upload to Cloudinary
        const result = await uploadToCloudinary(watermarkedBuffer, 'HGEnterprises/products');

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error("Upload route image processing failed:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
