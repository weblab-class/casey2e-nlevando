import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: { type: String, required: true },
  height: { type: Number, required: true },
  ridePreferences: [{
    rideId: { type: Number, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
  }],
  profileComplete: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      // Find or create user
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create new user from Google profile
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          height: 65, // Default height, user can update later
          ridePreferences: [],
          profileComplete: false
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Google Auth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Create JWT token
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth-callback?token=${token}`);
  }
);

// Profile Routes
app.post('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const { name, height, ridePreferences } = req.body;

    // Validate the data
    if (!name || !height || !Array.isArray(ridePreferences)) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        height: parseInt(height),
        ridePreferences: ridePreferences.map(pref => ({
          rideId: parseInt(pref.rideId),
          rating: parseInt(pref.rating)
        })),
        profileComplete: true
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB with robust error handling
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  waitQueueTimeoutMS: 30000,
})
.then(async () => {
  console.log('Connected to MongoDB');
  // Drop the username index if it exists
  try {
    await mongoose.connection.db.collection('users').dropIndex('username_1');
    console.log('Dropped username index');
  } catch (error) {
    // Index might not exist, which is fine
    console.log('No username index to drop');
  }
  // Only start the server after successful MongoDB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 