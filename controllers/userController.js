const User = require('../models/User');

const getUserProfile = (req, res) => {
    if (!req.user) {
        return res.status(402).json({ message: 'Not Authorized' });
    }

    res.status(200).json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
    })
};

const updateUserProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not Authorized' });
    }
    
    const { name, email, password } = req.body;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password && password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (name && name.trim().length < 3) {
        return res.status(400).json({ message: 'Name must be at least 3 characters' });
    }

    try {
        const user = await User.findById(req.user._id)
        
        if (!user) {
            return res.status(404).json({ message: 'User not found'})
        }

        if ('role' in req.body) {
            return res.status(403).json({ message: 'You are not allowed to change your role.' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);


        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });

    } catch (error) {
        res.status(500).json({ message: 'Error occured', error: error.message})
    }
};

module.exports = { getUserProfile, updateUserProfile };