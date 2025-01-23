import mongoose from 'mongoose';

const ridePreferenceSchema = new mongoose.Schema({
  rideId: { 
    type: Number, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  }
}, { _id: false }); // Prevent MongoDB from creating _id for subdocuments

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  height: { 
    type: Number, 
    required: true 
  },
  ridePreferences: {
    type: [ridePreferenceSchema],
    default: [],
    required: true
  },
  profileComplete: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true,  // Add createdAt and updatedAt fields
  strict: true      // Only allow fields defined in schema
});

// Add methods to the schema
userSchema.methods.updateProfile = async function(name, height) {
  this.name = name;
  this.height = height;
  this.profileComplete = true;
  return this.save();
};

userSchema.methods.updateRidePreference = async function(rideId, rating) {
  const existingIndex = this.ridePreferences.findIndex(pref => pref.rideId === rideId);
  if (existingIndex !== -1) {
    this.ridePreferences[existingIndex].rating = rating;
  } else {
    this.ridePreferences.push({ rideId, rating });
  }
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User; 