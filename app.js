require('dotenv').config();

// app.js
const express = require('express');
const app = express();

// Middleware for parsing
app.use(express.json());

// Import routes
const testRoutes = require('./routes/testRoutes');

// Use routes
app.use('/api/v1/test', testRoutes);

module.exports = app;