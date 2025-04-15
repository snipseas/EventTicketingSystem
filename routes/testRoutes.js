// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/db-status', (req, res) => {
    const status = mongoose.connection.readyState;

    // 1 = connected, 2 = connecting, 0 = disconnected
    let statusText = '';
    switch (status) {
        case 0:
            statusText = 'Disconnected ❌';
            break;
        case 1:
            statusText = 'Connected ✅';
            break;
        case 2:
            statusText = 'Connecting ⏳';
            break;
        default:
            statusText = 'Unknown';
    }

    res.status(200).json({ dbStatus: statusText });
});

module.exports = router;