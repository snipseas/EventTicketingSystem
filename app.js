require('dotenv').config();
const express = require('express');
const app = express();
const routes = require("./utils/routesExporter.js")

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("Working")
});
app.use('/api/v1/auth', routes.auth);
app.use('/api/v1/test', routes.test);
app.use('/api/v1/users', routes.user);
app.use('/api/v1/bookings', routes.booking);


// app.get((req, res) => {
//     res.status(404).json({ message: 'Route not found' });
// });

module.exports = app;