import React, { useState } from 'react';
import { X, Frown, Meh, Smile, SmilePlus, Heart } from 'lucide-react';

interface ProfileSetupProps {
  onClose: () => void;
  onComplete: () => void;
  initialData: {
    email: string;
    name: string;
    height?: number;
    ridePreferences?: { rideId: number; rating: number; }[];
  };
}

interface FormData {
  name: string;
  height: string;
  ridePreferences: {
    [key: number]: number;
  };
}

const RIDES = [
  // Jurassic Park
  { id: 1, name: "Jurassic Park River Adventure" },
  { id: 2, name: "Jurassic World VelociCoaster" },
  { id: 3, name: "Skull Island: Reign of Kong" },
  
  // Marvel Super Hero Island
  { id: 4, name: "Doctor Doom's Fearfall" },
  { id: 5, name: "Storm Force Accelatron" },
  { id: 6, name: "The Amazing Adventures of Spider-Man" },
  { id: 7, name: "The Incredible Hulk Coaster" },

  // Seuss Landing
  { id: 8, name: "Caro-Seuss-el" },
  { id: 9, name: "One Fish, Two Fish, Red Fish, Blue Fish" },
  { id: 10, name: "The Cat in The Hat" },
  { id: 11, name: "The High in the Sky Seuss Trolley Train Ride!" },

  // The Wizarding World of Harry Potter - Hogsmeade
  { id: 12, name: "Flight of the Hippogriff" },
  { id: 13, name: "Hagrid's Magical Creatures Motorbike Adventure" },
  { id: 14, name: "Harry Potter and the Forbidden Journey" },

  // Toon Lagoon
  { id: 15, name: "Dudley Do-Right's Ripsaw Falls" },
  { id: 16, name: "Popeye & Bluto's Bilge-Rat Barges" }
];

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onClose, onComplete, initialData }) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name,
    height: initialData.height?.toString() || '',
    ridePreferences: RIDES.reduce((acc, ride) => {
      const existingPreference = initialData.ridePreferences?.find(pref => pref.rideId === ride.id);
      return {
        ...acc,
        [ride.id]: existingPreference?.rating || 3 // Use existing rating or default to 3
      };
    }, {})
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      // Convert ride preferences from object to array format
      const ridePreferencesArray = Object.entries(formData.ridePreferences).map(([rideId, rating]) => ({
        rideId: parseInt(rideId),
        rating: rating
      }));

      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          height: parseInt(formData.height),
          ridePreferences: ridePreferencesArray
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      const data = await response.json();
      console.log('Profile saved successfully:', data);
      
      // Store user data in localStorage for easy access
      localStorage.setItem('userData', JSON.stringify({
        name: formData.name,
        email: initialData.email,
        height: parseInt(formData.height),
        ridePreferences: ridePreferencesArray,
        profileComplete: true
      }));

      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const getRatingIcon = (rating: number, isSelected: boolean) => {
    const className = `h-6 w-6 ${isSelected ? 'text-yellow-400' : 'text-gray-400'} cursor-pointer hover:text-yellow-400 transition-colors`;
    switch (rating) {
      case 1: return <Frown className={className} />;
      case 2: return <Meh className={className} />;
      case 3: return <Smile className={className} />;
      case 4: return <SmilePlus className={className} />;
      case 5: return <Heart className={className} />;
      default: return null;
    }
  };

  const handleRatingChange = (rideId: number, rating: number) => {
    setFormData(prev => ({
      ...prev,
      ridePreferences: {
        ...prev.ridePreferences,
        [rideId]: rating
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Height Input */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (in inches)
              </label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="36"
                max="84"
              />
              <p className="mt-1 text-sm text-gray-500">
                Example: 60 for 5 feet, 72 for 6 feet
              </p>
            </div>

            {/* Ride Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Interest in These Rides</h3>
              <div className="space-y-6">
                {/* Jurassic Park */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Jurassic Park</h4>
                  <div className="space-y-4">
                    {RIDES.slice(0, 3).map(ride => (
                      <div key={ride.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{ride.name}</span>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(ride.id, rating)}
                              className="focus:outline-none"
                            >
                              {getRatingIcon(rating, formData.ridePreferences[ride.id] === rating)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marvel Super Hero Island */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Marvel Super Hero Island</h4>
                  <div className="space-y-4">
                    {RIDES.slice(3, 7).map(ride => (
                      <div key={ride.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{ride.name}</span>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(ride.id, rating)}
                              className="focus:outline-none"
                            >
                              {getRatingIcon(rating, formData.ridePreferences[ride.id] === rating)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seuss Landing */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Seuss Landing</h4>
                  <div className="space-y-4">
                    {RIDES.slice(7, 11).map(ride => (
                      <div key={ride.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{ride.name}</span>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(ride.id, rating)}
                              className="focus:outline-none"
                            >
                              {getRatingIcon(rating, formData.ridePreferences[ride.id] === rating)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Wizarding World of Harry Potter */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">The Wizarding World of Harry Potter - Hogsmeade</h4>
                  <div className="space-y-4">
                    {RIDES.slice(11, 14).map(ride => (
                      <div key={ride.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{ride.name}</span>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(ride.id, rating)}
                              className="focus:outline-none"
                            >
                              {getRatingIcon(rating, formData.ridePreferences[ride.id] === rating)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toon Lagoon */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Toon Lagoon</h4>
                  <div className="space-y-4">
                    {RIDES.slice(14).map(ride => (
                      <div key={ride.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{ride.name}</span>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(ride.id, rating)}
                              className="focus:outline-none"
                            >
                              {getRatingIcon(rating, formData.ridePreferences[ride.id] === rating)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-colors"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 