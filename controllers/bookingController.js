const Booking = require('../booking.model');
const Event = require('../event.model');

const bookingController = {

    getMyBookings: async (req, res) => {
        try {
            const bookings = await Booking.find({ user: req.user._id }).populate('event');
            return res.status(200).json(user.bookings);
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },

    cancelBooking: async (req, res) => {
        try {
            const bookingId = req.params.id;
        
            // Find the booking
            const booking = await Booking.findById(bookingId);
            if (!booking) {
              return res.status(404).json({ message: 'Booking not found' });
            }
        
            // Ensure user owns the booking
            if (booking.user.toString() !== req.user._id.toString()) {
              return res.status(403).json({ message: 'Unauthorized access' });
            }
        
            // Check if already canceled
            if (booking.status === 'Canceled') {
              return res.status(400).json({ message: 'Booking is already canceled' });
            }
        
            // Update booking status
            booking.status = 'Canceled';
            await booking.save();
        
            // Increase event's remaining tickets
            const event = await Event.findById(booking.event);
            if (event) { //to avoid errors if the event no longer exists
              event.remainingTickets += booking.ticketsBooked;
              await event.save();
            }
        
            return res.status(200).json({ message: 'Booking canceled successfully', booking });
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },

    bookTickets: async (req, res) => {
        try {
            const { eventId, ticketsBooked } = req.body;
        
            // makes sure event exists and number of tickets booked isnt 0
            if (!eventId || !ticketsBooked || ticketsBooked <= 0) {
              return res.status(400).json({ message: 'Invalid booking data' });
            }
        
            // Fetch the event
            const event = await Event.findById(eventId);
            if (!event) {
              return res.status(404).json({ message: 'Event not found' });
            }
        
            // check ticket availability
            if (event.remainingTickets < ticketsBooked) {
              return res.status(400).json({ message: 'Not enough tickets available' });
            }
        
            // calculate total price
            const totalPrice = ticketsBooked * event.ticketPrice;
        
            // create booking
            const booking = new Booking({
              user: req.user._id,
              event: event._id,
              ticketsBooked,
              totalPrice,
              status: 'Confirmed',
            });
        
            await booking.save();
        
            // Reduce remaining tickets
            event.remainingTickets -= ticketsBooked;
            await event.save();
        
            return res.status(201).json({
              message: 'Booking successful',
              booking,
            });
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    }

};

module.exports = bookingController;