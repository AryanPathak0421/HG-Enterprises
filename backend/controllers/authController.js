const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'user'
        });

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
        });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, addresses: user.addresses }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Get User Profile (Protected)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
};

// Update Address (Protected)
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newAddress = { ...req.body, id: Date.now().toString() };
        if (newAddress.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }
        user.addresses.push(newAddress);
        await user.save();

        res.status(200).json({ message: 'Address added successfully', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add address', error: error.message });
    }
};
// --- OTP AUTH (Simplified/Testing) ---

// 1. Send OTP (Mock)
exports.sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone || phone.length !== 10) return res.status(400).json({ message: 'Invalid phone number' });

        const user = await User.findOne({ phone });

        console.log(`[AUTH] Mock OTP sent to +91 ${phone}: 123456`);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully (Testing Mode)',
            exists: !!user
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// 2. Verify OTP & Login/Signup
exports.verifyOTP = async (req, res) => {
    try {
        const { phone, otp, name, email } = req.body;

        // Master OTP bypass as requested
        if (otp !== '123456') {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        // Find User
        let user = await User.findOne({ phone });

        // If user not found and it's a login attempt (no name provided)
        if (!user && !name) {
            return res.status(404).json({ success: false, message: 'Account not found. Please register first.' });
        }

        // If user not found and it's a signup attempt
        if (!user && name) {
            user = await User.create({
                phone,
                name: name || `User ${phone.slice(-4)}`,
                email: email || `${phone}@hg.com`,
                role: 'user',
                password: await bcrypt.hash(Math.random().toString(36), 10)
            });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, addresses: user.addresses }
        });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

// Remove Address (Protected)
exports.removeAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
        await user.save();

        res.status(200).json({ message: 'Address removed successfully', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove address', error: error.message });
    }
};

// Update Profile (Protected)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
};

// Toggle Wishlist (Protected)
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.wishlist.indexOf(productId);
        if (index === -1) {
            user.wishlist.push(productId);
            await user.save();
            res.status(200).json({ message: 'Added to wishlist', wishlist: user.wishlist });
        } else {
            user.wishlist.splice(index, 1);
            await user.save();
            res.status(200).json({ message: 'Removed from wishlist', wishlist: user.wishlist });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update wishlist', error: error.message });
    }
};

// Notification Management (Protected)
exports.markNotificationRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const notification = user.notifications.id(req.params.id);
        if (notification) {
            notification.read = true;
            await user.save();
        }

        res.status(200).json({ message: 'Notification marked as read', notifications: user.notifications });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notification', error: error.message });
    }
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};
// Block/Unblock User (Admin)
exports.toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user status', error: error.message });
    }
};
