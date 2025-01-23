// Profile Routes
app.post('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const { name, height, rideId, rating } = req.body;
    console.log('Received profile update request:', { name, height, rideId, rating });

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If updating a single ride rating
    if (rideId !== undefined && rating !== undefined) {
      console.log('Updating ride preference:', { rideId, rating });
      console.log('Current preferences:', user.ridePreferences);
      
      const updatedUser = await user.updateRidePreference(rideId, rating);
      console.log('Updated preferences:', updatedUser.ridePreferences);
      
      return res.json(updatedUser);
    }

    // If updating profile (name and height only)
    if (!name || !height) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }

    console.log('Current user state:', {
      name: user.name,
      height: user.height,
      ridePreferences: user.ridePreferences
    });

    const updatedUser = await user.updateProfile(name, height);

    console.log('Updated user state:', {
      name: updatedUser.name,
      height: updatedUser.height,
      ridePreferences: updatedUser.ridePreferences
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
}); 