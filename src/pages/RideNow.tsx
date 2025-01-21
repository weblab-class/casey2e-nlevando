import React, { useState } from 'react';
import { Clock, MapPin, Frown, Meh, Smile, SmilePlus, Heart, RefreshCw, Ruler, Info, Accessibility, FlipHorizontal } from 'lucide-react';

interface Ride {
  id: number;
  name: string;
  waitTime: number | 'Closed';
  location: string;
  userRating: number | null;
  isSingleRider?: boolean;
  heightRequirement: number; // in inches
  thrillLevel: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = extreme
  features: {
    goesUpsideDown?: boolean;
    isWaterRide?: boolean;
    hasAccessibleVehicle?: boolean;
    mustTransfer?: boolean;
    specialNotes?: string;
  };
}

interface Land {
  name: string;
  rides: Ride[];
}

const RideCard: React.FC<{ ride: Ride; onRate: (id: number, rating: number) => void }> = ({ ride, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getThrillLevelText = (level: number) => {
    switch (level) {
      case 1: return "Mild - Perfect for all ages";
      case 2: return "Moderate - Some small thrills";
      case 3: return "Exciting - Moderate thrills";
      case 4: return "Thrilling - High intensity";
      case 5: return "Extreme - Maximum thrills";
      default: return "";
    }
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

  return (
    <div 
      className="relative h-[400px] perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden p-4 h-full flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-4">
              {ride.name}
            </h3>
            
            <div className="space-y-4 flex-grow">
              {/* Wait Time */}
              <div className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-sm uppercase tracking-wide">Current Wait</span>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="text-lg font-semibold">
                      {ride.waitTime === 'Closed' ? 'Closed' : `${ride.waitTime} min`}
                    </span>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onRate(ride.id, rating);
                      }}
                      className="focus:outline-none"
                    >
                      {getRatingIcon(rating, ride.userRating === rating)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Flip indicator */}
            <div className="flex items-center justify-center text-gray-400 text-sm mt-4 gap-2">
              <FlipHorizontal className="h-4 w-4" />
              <span>Tap for ride details</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden p-4 h-full">
            <h3 className="text-xl font-semibold text-white mb-4">Ride Details</h3>
            
            <div className="space-y-4">
              {/* Height Requirement */}
              <div className="flex items-center text-gray-300">
                <Ruler className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Minimum Height: {Math.floor(ride.heightRequirement / 12)}'{ride.heightRequirement % 12}"</span>
              </div>

              {/* Thrill Level */}
              <div className="flex items-center text-gray-300">
                <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Thrill Level: {getThrillLevelText(ride.thrillLevel)}</span>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {ride.features.goesUpsideDown && (
                  <div className="text-yellow-400">⚠️ Goes upside down</div>
                )}
                {ride.features.isWaterRide && (
                  <div className="text-blue-400">💦 Water ride - You may get wet</div>
                )}
                {ride.features.hasAccessibleVehicle && (
                  <div className="flex items-center text-green-400">
                    <Accessibility className="h-4 w-4 mr-2" />
                    Accessible vehicle available
                  </div>
                )}
                {ride.features.mustTransfer && (
                  <div className="text-orange-400">Must transfer from wheelchair</div>
                )}
                {ride.features.specialNotes && (
                  <div className="text-gray-300 mt-2">
                    <strong>Note:</strong> {ride.features.specialNotes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RideNow: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([
    {
      name: "Jurassic Park",
      rides: [
        {
          id: 1,
          name: "Jurassic Park River Adventure",
          waitTime: "Closed",
          location: "Jurassic Park",
          userRating: null,
          heightRequirement: 42,
          thrillLevel: 4,
          features: {
            isWaterRide: true,
            hasAccessibleVehicle: true,
            specialNotes: "85-foot plunge in complete darkness"
          }
        },
        {
          id: 2,
          name: "Jurassic World VelociCoaster",
          waitTime: 15,
          location: "Jurassic Park",
          userRating: null,
          heightRequirement: 54,
          thrillLevel: 5,
          features: {
            goesUpsideDown: true,
            isWaterRide: false,
            hasAccessibleVehicle: true,
            mustTransfer: true,
            specialNotes: "Maximum height requirement: 54 inches"
          }
        },
        {
          id: 3,
          name: "Skull Island: Reign of Kong",
          waitTime: 5,
          location: "Jurassic Park",
          userRating: null,
          heightRequirement: 48,
          thrillLevel: 3,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Maximum height requirement: 48 inches"
          }
        },
      ],
    },
    {
      name: "Marvel Super Hero Island",
      rides: [
        {
          id: 4,
          name: "Doctor Doom's Fearfall",
          waitTime: 10,
          location: "Marvel Super Hero Island",
          userRating: null,
          heightRequirement: 48,
          thrillLevel: 2,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Maximum height requirement: 48 inches"
          }
        },
        {
          id: 5,
          name: "Storm Force Accelatron",
          waitTime: 5,
          location: "Marvel Super Hero Island",
          userRating: null,
          heightRequirement: 54,
          thrillLevel: 5,
          features: {
            goesUpsideDown: true,
            isWaterRide: false,
            hasAccessibleVehicle: true,
            mustTransfer: true,
            specialNotes: "Maximum height requirement: 54 inches"
          }
        },
        {
          id: 6,
          name: "The Amazing Adventures of Spider-Man",
          waitTime: 10,
          location: "Marvel Super Hero Island",
          userRating: null,
          heightRequirement: 48,
          thrillLevel: 3,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Maximum height requirement: 48 inches"
          }
        },
        {
          id: 7,
          name: "The Incredible Hulk Coaster",
          waitTime: 10,
          location: "Marvel Super Hero Island",
          userRating: null,
          heightRequirement: 54,
          thrillLevel: 5,
          features: {
            goesUpsideDown: true,
            isWaterRide: false,
            hasAccessibleVehicle: true,
            mustTransfer: true,
            specialNotes: "Maximum height requirement: 54 inches"
          }
        },
      ],
    },
    {
      name: "Seuss Landing",
      rides: [
        {
          id: 8,
          name: "Caro-Seuss-el",
          waitTime: 5,
          location: "Seuss Landing",
          userRating: null,
          heightRequirement: 42,
          thrillLevel: 1,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Perfect for all ages"
          }
        },
        {
          id: 9,
          name: "One Fish, Two Fish, Red Fish, Blue Fish",
          waitTime: 5,
          location: "Seuss Landing",
          userRating: null,
          heightRequirement: 42,
          thrillLevel: 1,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Perfect for all ages"
          }
        },
        {
          id: 10,
          name: "The Cat in The Hat",
          waitTime: 5,
          location: "Seuss Landing",
          userRating: null,
          heightRequirement: 42,
          thrillLevel: 1,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Perfect for all ages"
          }
        },
        {
          id: 11,
          name: "The High in the Sky Seuss Trolley Train Ride!",
          waitTime: 5,
          location: "Seuss Landing",
          userRating: null,
          heightRequirement: 42,
          thrillLevel: 1,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Perfect for all ages"
          }
        },
      ],
    },
    {
      name: "The Wizarding World of Harry Potter - Hogsmeade",
      rides: [
        {
          id: 12,
          name: "Flight of the Hippogriff",
          waitTime: 45,
          location: "The Wizarding World of Harry Potter - Hogsmeade",
          userRating: null,
          heightRequirement: 48,
          thrillLevel: 3,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Maximum height requirement: 48 inches"
          }
        },
        {
          id: 13,
          name: "Hagrid's Magical Creatures Motorbike Adventure",
          waitTime: 60,
          location: "The Wizarding World of Harry Potter - Hogsmeade",
          userRating: null,
          heightRequirement: 54,
          thrillLevel: 5,
          features: {
            goesUpsideDown: true,
            isWaterRide: false,
            hasAccessibleVehicle: true,
            mustTransfer: true,
            specialNotes: "Maximum height requirement: 54 inches"
          }
        },
        {
          id: 14,
          name: "Harry Potter and the Forbidden Journey",
          waitTime: 15,
          location: "The Wizarding World of Harry Potter - Hogsmeade",
          userRating: null,
          heightRequirement: 48,
          thrillLevel: 4,
          features: {
            isWaterRide: false,
            hasAccessibleVehicle: true,
            specialNotes: "Maximum height requirement: 48 inches"
          }
        },
      ],
    },
    {
      name: "Toon Lagoon",
      rides: [
        {
          id: 15,
          name: "Dudley Do-Right's Ripsaw Falls",
          waitTime: 5,
          location: "Toon Lagoon",
          userRating: null,
          heightRequirement: 42,
          thrillLevel: 1,
          features: {
            isWaterRide: true,
            hasAccessibleVehicle: true,
            specialNotes: "85-foot plunge in complete darkness"
          }
        },
        {
          id: 16,
          name: "Popeye & Bluto's Bilge-Rat Barges",
          waitTime: 10,
          location: "Toon Lagoon",
          userRating: null,
          heightRequirement: 42,
          thrillLevel: 1,
          features: {
            isWaterRide: true,
            hasAccessibleVehicle: true,
            specialNotes: "85-foot plunge in complete darkness"
          }
        },
      ],
    },
  ]);

  const [suggestedRide, setSuggestedRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const updateWaitTimes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/queue-times');
      const data = await response.json();
      
      // Update the wait times in our lands data
      setLands(prevLands => prevLands.map(land => ({
        ...land,
        rides: land.rides.map(ride => {
          const updatedLand = data.lands.find((l: any) => 
            l.name.toLowerCase().includes(land.name.toLowerCase())
          );
          
          const updatedRide = updatedLand?.rides.find((r: any) => 
            r.name.toLowerCase().includes(ride.name.toLowerCase())
          );
          
          if (updatedRide) {
            return {
              ...ride,
              waitTime: updatedRide.is_open ? updatedRide.wait_time : 'Closed'
            };
          }
          return ride;
        })
      })));

      // Update timestamp
      const now = new Date();
      setLastUpdated(
        `${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`
      );
    } catch (error) {
      console.error('Failed to fetch wait times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = (rideId: number, rating: number) => {
    setLands(lands.map(land => ({
      ...land,
      rides: land.rides.map(ride => 
        ride.id === rideId ? { ...ride, userRating: rating } : ride
      )
    })));
  };

  const suggestNextRide = () => {
    const allRides = lands.flatMap(land => land.rides);
    const openRides = allRides.filter(ride => ride.waitTime !== 'Closed' && !ride.isSingleRider);
    const lowestWaitTime = Math.min(...openRides.map(ride => ride.waitTime as number));
    
    // Get all rides that share the lowest wait time
    const lowestWaitRides = openRides.filter(ride => ride.waitTime === lowestWaitTime);
    
    // Randomly select one of the rides with the lowest wait time
    const randomIndex = Math.floor(Math.random() * lowestWaitRides.length);
    const suggestedRide = lowestWaitRides[randomIndex];
    
    setSuggestedRide(suggestedRide || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Universal's Islands of Adventure</h1>
          <button
            onClick={updateWaitTimes}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            Check Wait Times
          </button>
        </div>
        {lastUpdated && (
          <div className="text-gray-400 text-sm flex justify-between items-center">
            <span>Powered by Queue-Times.com</span>
            <span>Last updated: {lastUpdated}</span>
          </div>
        )}
      </div>

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

      {/* Lands and Rides Grid */}
      {lands.map((land) => (
        <div key={land.name} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{land.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {land.rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onRate={handleRating} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RideNow;