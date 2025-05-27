const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    bookTickets,
    getBookingById,
    cancelBooking,
    getMyBookings,
} = require('../controllers/bookingController');

const router = express.Router();

// Standard User Routes
router.get('/my-bookings', protect, authorize('user'), getMyBookings);
router.post('/', protect, authorize('user'), bookTickets);

// Parameterized Routes (must come last)
router.get('/:id', protect, authorize('user'), getBookingById);
router.delete('/:id', protect, authorize('user'), cancelBooking);

module.exports = router;