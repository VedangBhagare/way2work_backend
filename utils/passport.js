const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Function to generate a unique 7-digit user ID
async function getNextUserId() {
  const lastUser = await User.findOne().sort({ user_id: -1 });
  const newId = lastUser ? parseInt(lastUser.user_id) + 1 : 1;
  return newId.toString().padStart(7, "0");
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || profile._json?.email || null;
    const profilePic = profile.photos?.[0]?.value || null;

    if (!email) return done(null, false);

    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    const user = await User.findOne({ email });
    if (user) {
      user.googleId = profile.id;
      if (!user.profilePic && profilePic) {
        user.profilePic = profilePic;
      }
      await user.save();
      return done(null, user);
    }

    const user_id = await getNextUserId();
    const newUser = new User({
      user_id,
      username: profile.displayName,
      email,
      googleId: profile.id,
      profilePic,
      role: 'user'
    });

    await newUser.save();
    done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Store MongoDB user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = require('passport');
