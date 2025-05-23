const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  googleId: { type: String, sparse: true, default: null },
  profilePic: { type: String, default: null },
  authProvider: { type: String, enum: ['manual', 'google', 'linkedin'], default: 'manual' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

// Pre-save hook to generate and format user_id
userSchema.pre('save', async function (next) {
    if (!this.user_id) {
        try {
            const lastUser = await mongoose.models.User.findOne().sort({ user_id: -1 });

            // Ensure lastUser has a valid user_id, otherwise start from "0000001"
            let newId = lastUser && lastUser.user_id && !isNaN(parseInt(lastUser.user_id))
                ? parseInt(lastUser.user_id) + 1
                : 1;

            if (newId > 1000000) {
                return next(new Error("User limit of 1000000 reached. Cannot create more users."));
            }

            // Ensure user_id is always 7 digits long
            this.user_id = newId.toString().padStart(7, '0');
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
