const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized: No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ user_id: decoded.user_id });

    if (!user)
      return res.status(401).json({ message: 'Unauthorized: User not found' });

    req.user = user; // Attach user object to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admins only' });
};

module.exports = {
  isAuthenticated,
  isAdmin
};
