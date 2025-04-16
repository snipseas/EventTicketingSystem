const Event = require('../models/Event');
const User = require('../models/User');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, ticketsAvailable } = req.body;
   
    if (!title || !description || !date || !location || price === undefined || ticketsAvailable === undefined) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide all required fields' 
      });
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      price,
      ticketsAvailable,
      organizer: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newEvent
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    let query = {};

    
    if (!req.user?.isAdmin) {
      query.status = 'approved';
    }
    if (req.user?.isOrganizer) {
      query = {
        $or: [
          { organizer: req.user.id },
          { status: 'approved' }
        ]
      };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    if (event.status !== 'approved' && 
        (!req.user || (!req.user.isAdmin && req.user.id !== event.organizer._id.toString()))) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this event'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

 
    if (!req.user.isAdmin && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this event'
      });
    }

    if (req.user.isOrganizer) {
      req.body.status = 'pending';
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedEvent
    });

  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to update event'
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    if (!req.user.isAdmin && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this event'
      });
    }

    await event.remove();

    res.json({
      success: true,
      data: {}
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    });
  }
};

exports.updateEventStatus = async (req, res) => {
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
      req.params.id,
      { status },
      { new: true }
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

exports.getEventAnalytics = async (req, res) => {
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
