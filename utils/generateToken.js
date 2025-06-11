require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id, // ✅ Use user_id instead of _id
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = generateToken;
