const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { getUserProfile, updateUserProfile } = require('../controllers/userController.js');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;