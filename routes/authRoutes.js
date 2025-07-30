// routes/userRoutes.js
const express = require('express');

const { isAuthenticated } = require('../middleWare/authMiddleware');

const User = require('../models/User');
const bcrypt = require('bcryptjs');

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleCallback,
  googleSuccess,
  googleMobileLogin
} = require('../controllers/authController');

const passport = require('passport');
const router = express.Router();

// Manual Auth
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google-mobile', googleMobileLogin);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false
}), googleCallback);

// Redirect success
router.get('/google-success', googleSuccess);

//Fetch User Info
router.get('/user', isAuthenticated, (req, res) => {
  res.json({
    user_id: req.user.user_id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role
  });
});

// Update User Info
router.put('/user/update', isAuthenticated, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ user_id: req.user.user_id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;