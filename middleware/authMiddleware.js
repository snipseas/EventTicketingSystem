// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnauthorizedError } = require('./errorHandler'); // Add this import

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            next(new UnauthorizedError('Not authorized, token failed'));
        }
    } else {
        next(new UnauthorizedError('Not authorized, no token'));
    }
};

module.exports = protect; // Default export