const express = require("express");
const bookingController = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/my-bookings', protect, authorize('User'), bookingController.getMyBookings);
router.post('/book', protect, authorize('User'), bookingController.bookTickets);
router.put('/cancel/:id', protect, authorize('User'), bookingController.cancelBooking);

module.exports = router;