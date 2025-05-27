const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createEvent,
    getApprovedEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    getEventAnalytics,
    getMyEvents
} = require('../controllers/eventController');

const router = express.Router();

// Public Routes
router.get('/', getApprovedEvents); // Get list of all approved events

// Admin & Organizer Routes
router.get('/analytics', protect, authorize('admin', 'organizer'), getEventAnalytics); // Get event analytics

// Event Organizer Routes
router.get('/my-events', protect, authorize('organizer'), getMyEvents); // Get organizer's events
router.post('/', protect, authorize('organizer'), createEvent); // Create a new event

// Event Organizer & Admin Routes
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent); // Update an event
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent); // Delete an event

// Admin Routes
router.put('/:id/status', protect, authorize('admin'), updateEventStatus); // Update event status

// Public Routes (must come last)
router.get('/:id', getEventById); // Get details of a single event

module.exports = router;