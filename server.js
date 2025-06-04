// Import core modules and dependencies
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('./utils/passport');

// Load environment variables from .env
require('dotenv').config();

// Connect to MongoDB and initialize real-time watchers
connectDB()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1); // Exit if DB connection fails
    });


// Initialize Express app
const app = express();

app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://192.168.56.1:8081',
    'http://localhost:5000'
  ],
  credentials: true,
}));



// Built-in middleware setup
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

require('./utils/passport');
app.use('/api/auth', require('./routes/authRoutes'));

// Start the Express server
const PORT = process.env.PORT || 5000;

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});

