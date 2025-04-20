const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', eventController.getEvents); 

router.get('/:id', eventController.getEvent); 


router.use(protect); 

router.post(
  '/', 
  authorize('organizer'), 
  eventController.createEvent
);

router.put(
  '/:id',
  authorize('organizer'), 
  eventController.updateEvent
);

router.delete(
  '/:id',
  authorize('organizer'), 
  eventController.deleteEvent
);

router.put(
  '/:id/status', 
  authorize('admin'), 
  eventController.updateEventStatus
);


router.get(
  '/analytics/all',
  authorize('admin', 'organizer'), 
  eventController.getEventAnalytics
);

module.exports = router;