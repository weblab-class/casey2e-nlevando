import React, { useState } from 'react';
import { Clock, MapPin, Frown, Meh, Smile, SmilePlus, Heart } from 'lucide-react';

interface Ride {
  id: number;
  name: string;
  waitTime: number;
  location: string;
  userRating: number | null;
}

const RideNow: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([
    {
      id: 1,
      name: "Jurassic World VelociCoaster",
      waitTime: 85,
      location: "Jurassic World",
      userRating: null,
    },
    {
      id: 2,
      name: "Hagrid's Magical Creatures Motorbike Adventure",
      waitTime: 120,
      location: "The Wizarding World of Harry Potter - Hogsmeade",
      userRating: null,
    },
    {
      id: 3,
      name: "The Amazing Adventures of Spider-Man",
      waitTime: 45,
      location: "Marvel Super Hero Island",
      userRating: null,
    },
  ]);

  const [suggestedRide, setSuggestedRide] = useState<Ride | null>(null);

  const handleRating = (rideId: number, rating: number) => {
    setRides(rides.map(ride => 
      ride.id === rideId ? { ...ride, userRating: rating } : ride
    ));
  };

  const getRatingIcon = (rating: number, isSelected: boolean, size: number = 24) => {
    const className = `h-${size} w-${size} ${isSelected ? 'text-yellow-400' : 'text-gray-400'} cursor-pointer hover:text-yellow-400 transition-colors`;
    switch (rating) {
      case 1: return <Frown className={className} />;
      case 2: return <Meh className={className} />;
      case 3: return <Smile className={className} />;
      case 4: return <SmilePlus className={className} />;
      case 5: return <Heart className={className} />;
      default: return null;
    }
  };

  const suggestNextRide = () => {
    // In a real app, this would use an algorithm considering wait times and user preferences
    const lowestWaitTime = Math.min(...rides.map(ride => ride.waitTime));
    const suggestedRide = rides.find(ride => ride.waitTime === lowestWaitTime);
    setSuggestedRide(suggestedRide || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Suggestion Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Available Rides</h2>
          <button
            onClick={suggestNextRide}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Suggest Next Ride
          </button>
        </div>
        
        {suggestedRide && (
          <div className="bg-green-500/20 backdrop-blur-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">Suggested Next Ride:</h3>
            <p className="text-green-300 text-lg">
              {suggestedRide.name} - {suggestedRide.waitTime} minute wait
            </p>
          </div>
        )}
      </div>

      {/* Rides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.map((ride) => (
          <div key={ride.id} className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">{ride.name}</h3>
              
              <div className="space-y-4">
                {/* Wait Time */}
                <div className="bg-black/20 rounded-lg p-3">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-sm uppercase tracking-wide">Current Wait</span>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <span className="text-lg font-semibold">{ride.waitTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{ride.location}</span>
                </div>

                {/* Rating System */}
                <div className="border-t border-white/10 pt-4">
                  <label className="block text-sm text-gray-300 mb-2">Rate this ride:</label>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRating(ride.id, rating)}
                        className="focus:outline-none"
                      >
                        {getRatingIcon(rating, ride.userRating === rating)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideNow;