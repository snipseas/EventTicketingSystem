// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware.js');
const { getUserProfile } = require('../controllers/userController.js');

router.get('/profile',  getUserProfile);

module.exports = router;