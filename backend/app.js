require('dotenv').config();
const express = require('express');
const app = express();
const routes = require("./utils/routesExporter.js")
const { errorHandler } = require('./middleware/errorHandler');

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.status(200).send("Working")
});

// ACTUAL ROUTES (must come before catch-all)
app.use('/api/v1/auth', routes.auth);
app.use('/api/v1/bookings', routes.booking);  // Changed to match exporter
app.use('/api/v1/events', routes.event);      // Changed to match exporter
app.use('/api/v1/test', routes.test);
app.use('/api/v1/users', routes.user);// Add this line for events

// Catch-all for undefined routes (MUST COME AFTER ALL ROUTES)
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
});

// Error handler (MUST BE LAST)
app.use(errorHandler);

module.exports = app;