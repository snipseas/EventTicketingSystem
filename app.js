require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = app;