const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgetPassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgetPassword', forgetPassword);

module.exports = router;