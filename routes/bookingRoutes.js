const express = require('express');
const {
  NotFoundError,
  UnauthorizedError
} = require('../middleware/errorHandler');
const Booking = require('../models/Booking');

const router = express.Router();

// Get booking by ID
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      throw new NotFoundError('Booking');
    }
    
    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      throw new UnauthorizedError();
    }
    
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// Other booking routes...
module.exports = router;