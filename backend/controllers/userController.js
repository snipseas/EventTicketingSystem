const User = require('../models/User');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const bcrypt = require('bcrypt');

const getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not Authorized' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

const updateUserProfile = async(req, res) => {
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
            return res.status(404).json({ message: 'User not found' })
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
        res.status(500).json({ message: 'Error occured', error: error.message })
    }
};

// Fetch all users (Admin only)
const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Fetch a user by ID (Admin only)
const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Update a user's role (Admin only)
const updateUserRole = async(req, res) => {
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        const updatedUser = await user.save();
        res.status(200).json({ message: 'User role updated', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
};

// Delete a user (Admin only)
const deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// Fetch current user's bookings (Standard User)
const getUserBookings = async(req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('event');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// Fetch current user's events (Event Organizer)
const getUserEvents = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not Authorized' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const events = await Event.find({ organizer: req.user._id });
        res.status(200).json(events);
    } catch (error) {
        console.error('Events fetch error:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Fetch analytics for current user's events (Event Organizer)
const getUserEventAnalytics = async(req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id });
        const analytics = events.map(event => ({
            eventId: event._id,
            name: event.name,
            totalTickets: event.totalTickets,
            availableTickets: event.availableTickets,
            soldTickets: event.totalTickets - event.availableTickets,
        }));

        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event analytics', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getUserBookings,
    getUserEvents,
    getUserEventAnalytics,
};