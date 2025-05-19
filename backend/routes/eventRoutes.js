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
} = require('../controllers/eventController');

const router = express.Router();

// Public Routes
router.get('/', getApprovedEvents); // Get list of all approved events
router.get('/:id', getEventById); // Get details of a single event

// Event Organizer Routes
router.post('/', protect, authorize('organizer'), createEvent); // Create a new event
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent); // Update an event
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent); // Delete an event

// Admin Routes
router.put('/:id/status', protect, authorize('admin'), updateEventStatus); // Update event status
router.get('/analytics', protect, authorize('admin', 'organizer'), getEventAnalytics); // Get event analytics

module.exports = router;