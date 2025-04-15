// config/db.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const connectDB = async() => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Connected successfully');

        // You can export the DB object if needed
        const db = client.db(); // You can also specify db name: client.db('yourDBName')
        return db;
    } catch (error) {
        console.error('❌MongoDB connection failed:' + error.message);
        process.exit(1);
    }
};

module.exports = connectDB;