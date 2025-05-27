const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Book tickets for an event (Standard User)
const bookTickets = async(req, res) => {
    const { eventId, ticketQuantity } = req.body;

    if (!eventId || !ticketQuantity) {
        return res.status(400).json({ message: 'Event ID and number of tickets are required' });
    }

    if (ticketQuantity < 1) {
        return res.status(400).json({ message: 'Ticket quantity must be at least 1' });
    }

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.status !== 'approved') {
            return res.status(400).json({ message: 'Cannot book tickets for an unapproved event' });
        }

        if (event.availableTickets < ticketQuantity) {
            return res.status(400).json({ 
                message: `Only ${event.availableTickets} tickets available` 
            });
        }

        // Use a transaction to ensure both operations succeed or fail together
        const session = await Booking.startSession();
        session.startTransaction();

        try {
            event.availableTickets -= ticketQuantity;
            await event.save({ session });

            const booking = await Booking.create([{
                user: req.user._id,
                event: eventId,
                ticketQuantity,
                totalPrice: ticketQuantity * event.price,
                status: 'confirmed'
            }], { session });

            await session.commitTransaction();
            session.endSession();

            const populatedBooking = await Booking.findById(booking[0]._id)
                .populate('event')
                .populate('user', 'name email');

            res.status(201).json({ 
                message: 'Booking successful', 
                booking: populatedBooking 
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            message: 'Error booking tickets', 
            error: error.message 
        });
    }
};

// Get booking details by ID (Standard User)
const getBookingById = async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('event')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.user._id.equals(req.user._id)) {
            return res.status(403).json({ message: 'You are not authorized to view this booking' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ 
            message: 'Error fetching booking', 
            error: error.message 
        });
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

        if (booking.status === 'canceled') {
            return res.status(400).json({ message: 'Booking is already canceled' });
        }

        const session = await Booking.startSession();
        session.startTransaction();

        try {
            const event = await Event.findById(booking.event);
            if (event) {
                event.availableTickets += booking.ticketQuantity;
                await event.save({ session });
            }

            booking.status = 'canceled';
            await booking.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: 'Booking canceled successfully' });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ 
            message: 'Error canceling booking', 
            error: error.message 
        });
    }
};

// Get all bookings for current user (Standard User)
const getMyBookings = async(req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'event',
                select: 'title date venue price image'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ 
            message: 'Error fetching bookings', 
            error: error.message 
        });
    }
};

module.exports = {
    bookTickets,
    getBookingById,
    cancelBooking,
    getMyBookings,
};