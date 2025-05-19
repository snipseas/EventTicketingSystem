const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgetPassword', forgetPassword);

router.get('/admin-only', protect, authorize('admin'), (req, res) => {
    res.json({ message: `Welcome Admin, ${req.user.name}` });
});

module.exports = router;