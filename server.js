// Import core modules and dependencies
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('./utils/passport');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// Initialize Express app
const app = express();

// CORS setup
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://192.168.56.1:8081',
    'http://localhost:5000',
    'http://192.168.56.1:5000',
    'http://192.168.52.207:8081', // ✅ Frontend dev server
    'http://192.168.52.207:5000',
    'http://10.0.0.5:5000',
    'http://10.192.76.65:5000' // ✅ Allow self
  ],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport auth middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobProfileRoutes'));  // 👈 Add Job Routes
app.use('/api/jobs/external', require('./routes/externaljobs'));
// Default route (optional)
app.get('/', (req, res) => {
  res.send('🚀 Way 2 Work API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
