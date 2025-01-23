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
import path from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Environment configuration
const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 5000,
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://thrillcompass.onrender.com'
    : 'http://localhost:5000',
  clientUrl: process.env.NODE_ENV === 'production'
    ? 'https://thrillcompass.onrender.com'
    : 'http://localhost:3000',
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL // Use the exact URL from environment variable
  }
};

// Debug logging for configuration
console.log('[SERVER] Environment:', config.nodeEnv);
console.log('[SERVER] Base URL:', config.baseUrl);
console.log('[SERVER] Client URL:', config.clientUrl);
console.log('[SERVER] Google Callback URL:', config.google.callbackUrl);
console.log('[SERVER] MongoDB URI:', config.mongodb.uri ? 'Present' : 'Missing');
console.log('[SERVER] JWT Secret:', config.jwt.secret ? 'Present' : 'Missing');
console.log('[SERVER] Google Client ID:', config.google.clientId ? 'Present' : 'Missing');

// Serve static files from the React app first
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://thrillcompass.onrender.com' 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackUrl,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      console.log('[Google Auth] Processing profile:', profile.id);
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        console.log('[Google Auth] Creating new user for:', profile.id);
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          height: 65,
          ridePreferences: [],
          profileComplete: false
        });
      }

      return done(null, user);
    } catch (error) {
      console.error('[Google Auth] Error:', error);
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
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    const redirectUrl = `${config.clientUrl}/auth-callback?token=${token}`;
    console.log('[Google Callback] Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
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

// Queue Times Route
app.get('/api/queue-times', async (req, res) => {
  try {
    const response = await fetch('https://queue-times.com/parks/64/queue_times.json');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Queue times error:', error);
    res.status(500).json({ error: 'Failed to fetch queue times' });
  }
});

// Move the catch-all route before MongoDB connection
app.get('*', (req, res) => {
  // Don't serve the frontend for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Connect to MongoDB with robust error handling
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  waitQueueTimeoutMS: 30000,
  retryWrites: true,
  w: 'majority',
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('[MongoDB] Connected successfully');
  // Use port 5000 by default for the backend
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('[MongoDB] Connection error:', err);
  process.exit(1);
}); 