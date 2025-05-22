const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    bookTickets,
    getBookingById,
    cancelBooking,
} = require('../controllers/bookingController');

const router = express.Router();

// Standard User Routes
router.post('/', protect, authorize('user'), bookTickets);
router.get('/:id', protect, authorize('user'), getBookingById);
router.delete('/:id', protect, authorize('user'), cancelBooking);

module.exports = router;