require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

connectDB();

const PORT = 5000; // Explicitly set port to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});