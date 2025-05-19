const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware.js');
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getUserBookings,
    getUserEvents,
    getUserEventAnalytics,
} = require('../controllers/userController.js');

const router = express.Router();

// Authenticated User Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin Routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Standard User Routes
router.get('/bookings', protect, authorize('user'), getUserBookings);

// Event Organizer Routes
router.get('/events', protect, authorize('organizer'), getUserEvents);
router.get('/events/analytics', protect, authorize('organizer'), getUserEventAnalytics);

module.exports = router;