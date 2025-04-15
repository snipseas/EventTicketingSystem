// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware.js');
const { getUserProfile, updateUserProfile } = require('../controllers/userController.js');


router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile)

module.exports = router;