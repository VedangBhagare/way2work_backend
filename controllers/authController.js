const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

require('dotenv').config();

// Register new user
const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      user_id: crypto.randomBytes(8).toString('hex'),
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();
    res.status(201).json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  console.log('Register request body:', req.body);

};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `http://localhost:5000/reset-password/${token}`;
    await sendEmail(email, 'Reset Password', `Reset your password: ${resetUrl}`);

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const googleCallback = async (req, res) => {
  const user = req.user;
  const token = generateToken(user);
  // You can redirect to frontend with token in query or cookie
  res.redirect(`http://localhost:3000/google-success?token=${token}`);
};

const googleSuccess = (req, res) => {
  res.json({ message: 'Google Login Success' });
};

const googleMobileLogin = async (req, res) => {
  console.log('📥 google-mobile route hit');
  console.log('Request body:', req.body);

  const { idToken } = req.body;
  console.log('🧪 Received idToken:', idToken);

  if (!idToken) return res.status(400).json({ message: 'Missing Google ID token' });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const user_id = await getNextUserId(); // Ensure this helper exists
      user = new User({
        user_id,
        username: name,
        email,
        googleId,
        profilePic: picture,
        authProvider: 'google',
        role: 'user'
      });
      await user.save();
      console.log('🆕 New user created:', email);
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.profilePic && picture) user.profilePic = picture;
      if (!user.authProvider) user.authProvider = 'google';
      await user.save();
      console.log('✅ Existing user updated:', email);
    }

    const token = generateToken(user);
    console.log('✅ Token generated and sent');
    return res.status(200).json({ token });

  } catch (err) {
    console.error('❌ Google Mobile Login Error:', err.message);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
};


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleCallback,
  googleSuccess,
  googleMobileLogin
};