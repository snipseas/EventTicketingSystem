// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnauthorizedError } = require('./errorHandler');
<<<<<<< HEAD:backend/middleware/authMiddleware.js

=======

const protect = async (req, res, next) => {
=======
const protect = async(req, res, next) => {
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
=======
>>>>>>> 4c5dbdd5daa4cf58f88523cbce826671a54ec5de:middleware/authMiddleware.js
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in the environment variables');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized to access this route' });
        }
        next();
    };
};
module.exports = { protect, authorize };
