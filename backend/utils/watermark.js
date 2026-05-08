const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Applies a premium watermark (logo + elegant brand text) to an image buffer.
 * @param {Buffer} imageBuffer - The original uploaded image buffer.
 * @returns {Promise<Buffer>} - The watermarked image buffer.
 */
async function applyWatermark(imageBuffer) {
    try {
        // Path to official gold transparent brand logo
        const logoPath = path.join(__dirname, '../assets/watermark_logo.png');
        
        // Initialize sharp instance for the main image and fetch metadata
        const mainImage = sharp(imageBuffer);
        const metadata = await mainImage.metadata();
        
        const width = metadata.width || 800;
        const height = metadata.height || 800;
        
        const composites = [];

        // 1. Generate elegant diagonal brand text watermark in gold
        const fontSize = Math.round(width * 0.045); // Dynamic font size based on width
        const svgText = `
            <svg width="${width}" height="${height}">
                <style>
                    .watermark-text {
                        fill: #D4AF37; /* Premium Metallic Gold */
                        fill-opacity: 0.12; /* Subtle transparency */
                        font-size: ${fontSize}px;
                        font-family: 'Cinzel', 'Playfair Display', 'Georgia', serif;
                        font-weight: 900;
                        letter-spacing: 0.15em;
                    }
                </style>
                <!-- Diagonal repeating brand watermark -->
                <text x="50%" y="35%" text-anchor="middle" transform="rotate(-30 ${width * 0.5} ${height * 0.35})" class="watermark-text">
                    HG ENTERPRISES
                </text>
                <text x="50%" y="65%" text-anchor="middle" transform="rotate(-30 ${width * 0.5} ${height * 0.65})" class="watermark-text">
                    HG ENTERPRISES
                </text>
            </svg>
        `;
        composites.push({
            input: Buffer.from(svgText),
            top: 0,
            left: 0
        });

        // 2. Add logo watermark at the center if the logo file exists
        if (fs.existsSync(logoPath)) {
            // Logo width should be roughly 25% of main image width
            const logoWidth = Math.round(width * 0.22);
            
            // Read logo, resize, and apply beautiful transparency
            const logoBuffer = await sharp(logoPath)
                .resize(logoWidth)
                .ensureAlpha()
                .composite([{
                    // Create a 1x1 buffer with alpha channel to act as opacity mask
                    input: Buffer.from([0, 0, 0, 90]), // 90/255 = ~35% opacity
                    raw: { width: 1, height: 1, channels: 4 },
                    blend: 'dest-in'
                }])
                .toBuffer();

            composites.push({
                input: logoBuffer,
                // Center the logo overlay
                gravity: 'center'
            });
        }

        // Apply all composites to the original image
        return await mainImage
            .composite(composites)
            .toBuffer();

    } catch (error) {
        console.error("Error applying watermark:", error);
        // Fallback to original image if anything goes wrong to avoid breaking the upload pipeline
        return imageBuffer;
    }
}

module.exports = { applyWatermark };
