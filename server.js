const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
dotenv.config();
connectDB();

const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})