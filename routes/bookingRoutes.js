const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  bookTicket,
  cancelBooking,
  getMyBookings,
  getBookingById,
} = require('../controllers/bookingController');

router.post('/', protect, bookTicket);
router.get('/', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
