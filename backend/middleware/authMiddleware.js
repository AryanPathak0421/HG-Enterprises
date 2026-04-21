const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(`[AUTH] Token Verified for User: ${decoded.id}, Role: ${decoded.role}`);
        next();
    } catch (error) {
        console.error(`[AUTH] Token Error: ${error.message}`);
        res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};

const adminMiddleware = (req, res, next) => {
    console.log(`[ADMIN CHECK] User Role: ${req.user?.role}`);
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.warn(`[ADMIN PROTECT] Forbidden: ${req.user?.id} attempted admin access with role: ${req.user?.role}`);
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { authMiddleware, adminMiddleware };
