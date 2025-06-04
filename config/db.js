//Load environment variables from .env file
require('dotenv').config();

//importing modules
const mongoose = require('mongoose');

//mongodb connection string
const { MONGODB_URI } = process.env;

//throw error if MongoDB URI is not defined
if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}

// Enable Mongoose debug mode to log database operations
mongoose.set('debug', true);

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // console.log("Mongo URI:", MONGODB_URI);

        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB connected');
            return mongoose.connection;
        }

        // Connect to MongoDB with custom options
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 90000,
            maxPoolSize: 20,
            connectTimeoutMS: 30000,
            minPoolSize: 5,
            driverInfo: {
                name: 'node.js',
                version: process.version,
                platform: process.platform,
                arch: process.arch,
            }
        });

        console.log('Connected to MongoDB');
        return mongoose.connection;

    } catch (err) {
        console.error('MongoDB connection error:', err);

        // Retry connection after 5 seconds if it fails
        setTimeout(connectDB, 5000);
    }
};

// Listen for connection errors after initial connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});


// Export the connectDB function for external use
module.exports = connectDB;