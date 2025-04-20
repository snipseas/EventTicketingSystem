const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    NotFoundError,
    InsufficientTicketsError,
    UnauthorizedError
} = require('../middleware/errorHandler');
const Event = require('../models/Event');

const router = express.Router();

router.get('/:id', async(req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            throw new NotFoundError('Event');
        }

        res.json(event);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/book', protect, async(req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        const { tickets } = req.body;

        if (!event) throw new NotFoundError('Event');
        if (event.ticketsAvailable < tickets) {
            throw new InsufficientTicketsError(event.ticketsAvailable, tickets);
        }

        if (!event.organizers.includes(req.user.id)) {
            throw new UnauthorizedError('Only organizers can book tickets');
        }

        event.ticketsAvailable -= tickets;
        await event.save();

        res.status(200).json({
            success: true,
            ticketsBooked: tickets,
            remainingTickets: event.ticketsAvailable
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;