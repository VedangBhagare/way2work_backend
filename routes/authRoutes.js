// routes/userRoutes.js
const express = require('express');

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

module.exports = router;