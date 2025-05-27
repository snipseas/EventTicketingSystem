const Event = require('../models/Event');
const User = require('../models/User');

// Create a new event (Event Organizer)
const createEvent = async(req, res) => {
    const { 
        title, 
        description, 
        date, 
        location, 
        category, 
        image, 
        price, 
        totalTickets 
    } = req.body;

    // Check required fields
    if (!title || !description || !date || !location || !category || !price || !totalTickets) {
        return res.status(400).json({ 
            message: 'Missing required fields',
            required: ['title', 'description', 'date', 'location', 'category', 'price', 'totalTickets']
        });
    }

    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            image: image || '',
            price,
            totalTickets,
            availableTickets: totalTickets,
            organizer: req.user._id,
        });

        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        console.error('Event creation error:', error);
        res.status(500).json({ 
            message: 'Error creating event', 
            error: error.message 
        });
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

// Get events created by the current organizer
const getMyEvents = async(req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json(events);
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({ 
            message: 'Error fetching your events', 
            error: error.message 
        });
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

        const { title, description, date, location, category, image, price, totalTickets } = req.body;

        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = date;
        if (location) event.location = location;
        if (category) event.category = category;
        if (image) event.image = image;
        if (price) event.price = price;
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
        if (req.user.role !== 'admin') {
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

        if (req.user.role === 'organizer') {
            query.organizer = req.user._id;
        }

        const events = await Event.find(query);

        const analytics = events.map(event => ({
            eventId: event._id,
            title: event.title,
            totalTickets: event.totalTickets,
            availableTickets: event.availableTickets,
            ticketsSold: event.totalTickets - event.availableTickets,
            soldPercentage: Math.round(((event.totalTickets - event.availableTickets) / event.totalTickets) * 100),
            revenue: (event.totalTickets - event.availableTickets) * event.price
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
    getMyEvents
};