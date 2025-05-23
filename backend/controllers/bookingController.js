const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Book tickets for an event (Standard User)
const bookTickets = async(req, res) => {
    const { eventId, tickets } = req.body;

    if (!eventId || !tickets) {
        return res.status(400).json({ message: 'Event ID and number of tickets are required' });
    }

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.availableTickets < tickets) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        event.availableTickets -= tickets;
        await event.save();

        const booking = await Booking.create({
            user: req.user._id,
            event: eventId,
            tickets,
        });

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error booking tickets', error: error.message });
    }
};

// Get booking details by ID (Standard User)
const getBookingById = async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('event');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'You are not authorized to view this booking' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
};

// Cancel a booking (Standard User)
const cancelBooking = async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
        }

        const event = await Event.findById(booking.event);
        if (event) {
            event.availableTickets += booking.tickets;
            await event.save();
        }

        await booking.remove();
        res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling booking', error: error.message });
    }
};

module.exports = {
    bookTickets,
    getBookingById,
    cancelBooking,
};