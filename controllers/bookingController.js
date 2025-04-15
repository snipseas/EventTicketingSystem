const Booking = require('../booking.model');
const Event = require('../event.model');

const bookTicket = async(req, res) => {
    const { eventId, quantity } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketsAvailable < quantity) {
        return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = quantity * event.price;

    const booking = await Booking.create({
        event: eventId,
        user: req.user._id,
        quantity,
        totalPrice,
    });

    event.ticketsAvailable -= quantity;
    event.ticketsSold += quantity;
    await event.save();

    res.status(201).json(booking);
};

const cancelBooking = async(req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (!booking.user.equals(req.user._id)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const event = await Event.findById(booking.event);
    event.ticketsAvailable += booking.quantity;
    event.ticketsSold -= booking.quantity;
    await event.save();

    await booking.remove();
    res.json({ message: 'Booking canceled successfully' });
};

const getMyBookings = async(req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('event');
    res.json(bookings);
};

const getBookingById = async(req, res) => {
    const booking = await Booking.findById(req.params.id).populate('event');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (!booking.user.equals(req.user._id)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(booking);
};

module.exports = {
    bookTicket,
    cancelBooking,
    getMyBookings,
    getBookingById,
};