const Event = require('../models/Event');
const User = require('../models/User');

// Create a new event (Event Organizer)
const createEvent = async(req, res) => {
    const { name, description, date, totalTickets } = req.body;

    if (!name || !description || !date || !totalTickets) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const event = await Event.create({
            name,
            description,
            date,
            totalTickets,
            availableTickets: totalTickets,
            organizer: req.user._id,
        });

        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Get list of all approved events (Public)
const getApprovedEvents = async(req, res) => {
    try {
        const events = await Event.find({ status: 'approved' });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Get details of a single event (Public)
const getEventById = async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// Update an event (Event Organizer or Admin)
const updateEvent = async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.organizer.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this event' });
        }

        const { name, description, date, totalTickets } = req.body;

        if (name) event.name = name;
        if (description) event.description = description;
        if (date) event.date = date;
        if (totalTickets) {
            event.availableTickets += totalTickets - event.totalTickets;
            event.totalTickets = totalTickets;
        }

        const updatedEvent = await event.save();
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete an event (Event Organizer or Admin)
const deleteEvent = async(req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.organizer.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }

        await event.remove();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

const updateEventStatus = async(req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        const { status } = req.body;
        if (!['approved', 'declined'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status value'
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: updatedEvent
        });

    } catch (error) {
        console.error('Error updating event status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update event status'
        });
    }
};

const getEventAnalytics = async(req, res) => {
    try {
        let query = {};

        if (req.user.isOrganizer) {
            query.organizer = req.user.id;
        }

        const events = await Event.find(query);

        const analytics = events.map(event => ({
            eventId: event._id,
            title: event.title,
            ticketsAvailable: event.ticketsAvailable,
            ticketsSold: event.ticketsSold,
            soldPercentage: Math.round((event.ticketsSold / event.ticketsAvailable) * 100),
            revenue: event.ticketsSold * event.price
        }));

        res.json({
            success: true,
            data: analytics
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics'
        });
    }
};
module.exports = {
    createEvent,
    getApprovedEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    getEventAnalytics,
};