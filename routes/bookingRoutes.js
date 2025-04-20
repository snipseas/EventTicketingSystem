const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const router = express.Router();

router.get('/my-bookings', authMiddleware, authorize(['User']), bookingController.getMyBookings);
router.post('/book', authMiddleware, authorize(['User']), bookingController.bookTickets);
router.put('/cancel/:id', authMiddleware, authorize(['User']), bookingController.cancelBooking);

module.exports = router;
