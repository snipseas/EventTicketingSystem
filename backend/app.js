require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const routes = require("./utils/routesExporter.js")
const { errorHandler } = require('./middleware/errorHandler');

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    res.status(200).send("Working")
});

// ACTUAL ROUTES (must come before catch-all)
app.use('/api/auth', routes.auth);
app.use('/api/bookings', routes.booking);
app.use('/api/events', routes.event);
app.use('/api/users', routes.user);

// Catch-all for undefined routes (MUST COME AFTER ALL ROUTES)
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
});

// Error handler (MUST BE LAST)
app.use(errorHandler);

module.exports = app;