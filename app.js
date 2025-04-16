require('dotenv').config();
const express = require('express');
const app = express();
const routes = require("./utils/routesExporter.js")

app.use(express.json());

<<<<<<< HEAD
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
=======
app.get('/', (req, res) => {
    res.status(200).send("Working")
>>>>>>> 5bdc016909c2a235e66d0fb5470d2961217a5168
});
app.use('/api/v1/auth', routes.auth);
app.use('/api/v1/test', routes.test);
app.use('/api/v1/users', routes.user);


// app.get((req, res) => {
//     res.status(404).json({ message: 'Route not found' });
// });

module.exports = app;