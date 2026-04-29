require('dotenv').config();
const mongoose = require('mongoose');

async function updateNavbar() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const result = await db.collection('settings').updateOne({}, {
        $set: {
            navbarLinks: [
                { id: 1, name: 'ABOUT', path: '/about' },
                { id: 2, name: 'BLOG', path: '/blogs' },
                { id: 3, name: 'OFFERS', path: '/offers' },
                { id: 4, name: 'SHOP', path: '/shop' },
                { id: 5, name: 'CONTACT US', path: '/help' },
                { id: 6, name: 'TRACK ORDER', path: '/profile/orders' }
            ]
        }
    });

    console.log('Navbar links updated:', result.modifiedCount, 'document(s) modified');
    process.exit(0);
}

updateNavbar().catch(e => { console.error(e); process.exit(1); });
