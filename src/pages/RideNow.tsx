import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Frown, Meh, Smile, SmilePlus, Heart, RefreshCw, Ruler, Info, Accessibility, FlipHorizontal, Settings, User } from 'lucide-react';
import ProfileSetup from '../components/ProfileSetup';

interface Ride {
  id: number;
  name: string;
  waitTime: number | 'Closed';
  location: string;
  userRating: number | null;
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

interface RidePreference {
  rideId: number;
  rating: number;
}

interface UserData {
  name: string;
  email: string;
  height: number;
  ridePreferences: RidePreference[];
  profileComplete: boolean;
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
    const className = `h-${size} w-${size} ${isSelected ? 'text-yellow-400' : 'text-gray-400'} transition-colors`;
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
                <label className="block text-sm text-gray-300 mb-2">Your Rating:</label>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating}>
                      {getRatingIcon(rating, ride.userRating === rating)}
                    </div>
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

interface RideNowProps {
  userData?: UserData;
  onProfileUpdate?: () => void;
}

const RIDES: Ride[] = [
  // Jurassic Park
  { 
    id: 1, 
    name: "Jurassic Park River Adventure",
    waitTime: 45,
    location: "Jurassic Park",
    heightRequirement: 42,
    thrillLevel: 4 as const,
    features: {
      isWaterRide: true,
      hasAccessibleVehicle: true,
      specialNotes: "85-foot plunge in complete darkness"
    },
    userRating: null
  },
  { 
    id: 2, 
    name: "Jurassic World VelociCoaster",
    waitTime: 60,
    location: "Jurassic Park",
    heightRequirement: 51,
    thrillLevel: 5 as const,
    features: {
      goesUpsideDown: true,
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "Florida's fastest and tallest launch coaster"
    },
    userRating: null
  },
  { 
    id: 3, 
    name: "Skull Island: Reign of Kong",
    waitTime: 35,
    location: "Jurassic Park",
    heightRequirement: 36,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Immersive 3D adventure ride"
    },
    userRating: null
  },
  
  // Marvel Super Hero Island
  { 
    id: 4, 
    name: "Doctor Doom's Fearfall",
    waitTime: 30,
    location: "Marvel Super Hero Island",
    heightRequirement: 52,
    thrillLevel: 4 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "Space shot drop tower"
    },
    userRating: null
  },
  { 
    id: 5, 
    name: "Storm Force Accelatron",
    waitTime: 15,
    location: "Marvel Super Hero Island",
    heightRequirement: 48,
    thrillLevel: 2 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Spinning ride featuring X-Men characters"
    },
    userRating: null
  },
  { 
    id: 6, 
    name: "The Amazing Adventures of Spider-Man",
    waitTime: 40,
    location: "Marvel Super Hero Island",
    heightRequirement: 40,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "3D motion simulator dark ride"
    },
    userRating: null
  },
  { 
    id: 7, 
    name: "The Incredible Hulk Coaster",
    waitTime: 45,
    location: "Marvel Super Hero Island",
    heightRequirement: 54,
    thrillLevel: 5 as const,
    features: {
      goesUpsideDown: true,
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "High-speed launch coaster"
    },
    userRating: null
  },

  // Seuss Landing
  { 
    id: 8, 
    name: "Caro-Seuss-el",
    waitTime: 10,
    location: "Seuss Landing",
    heightRequirement: 36,
    thrillLevel: 1 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Family-friendly carousel ride"
    },
    userRating: null
  },
  { 
    id: 9, 
    name: "One Fish, Two Fish, Red Fish, Blue Fish",
    waitTime: 15,
    location: "Seuss Landing",
    heightRequirement: 36,
    thrillLevel: 1 as const,
    features: {
      isWaterRide: true,
      hasAccessibleVehicle: true,
      specialNotes: "Interactive spinning ride - May get wet!"
    },
    userRating: null
  },
  { 
    id: 10, 
    name: "The Cat in The Hat",
    waitTime: 20,
    location: "Seuss Landing",
    heightRequirement: 36,
    thrillLevel: 2 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Dark ride based on the classic book"
    },
    userRating: null
  },
  { 
    id: 11, 
    name: "The High in the Sky Seuss Trolley Train Ride!",
    waitTime: 25,
    location: "Seuss Landing",
    heightRequirement: 36,
    thrillLevel: 1 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Elevated train ride with scenic views"
    },
    userRating: null
  },

  // The Wizarding World of Harry Potter - Hogsmeade
  { 
    id: 12, 
    name: "Flight of the Hippogriff",
    waitTime: 45,
    location: "The Wizarding World of Harry Potter - Hogsmeade",
    heightRequirement: 36,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Family-friendly roller coaster"
    },
    userRating: null
  },
  { 
    id: 13, 
    name: "Hagrid's Magical Creatures Motorbike Adventure",
    waitTime: 90,
    location: "The Wizarding World of Harry Potter - Hogsmeade",
    heightRequirement: 48,
    thrillLevel: 4 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "Story coaster with launches and drops"
    },
    userRating: null
  },
  { 
    id: 14, 
    name: "Harry Potter and the Forbidden Journey",
    waitTime: 60,
    location: "The Wizarding World of Harry Potter - Hogsmeade",
    heightRequirement: 48,
    thrillLevel: 4 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "Motion simulator with robotic arm technology"
    },
    userRating: null
  },

  // Toon Lagoon
  { 
    id: 15, 
    name: "Dudley Do-Right's Ripsaw Falls",
    waitTime: 35,
    location: "Toon Lagoon",
    heightRequirement: 44,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: true,
      hasAccessibleVehicle: false,
      mustTransfer: true,
      specialNotes: "Log flume ride - You will get wet!"
    },
    userRating: null
  },
  { 
    id: 16, 
    name: "Popeye & Bluto's Bilge-Rat Barges",
    waitTime: 25,
    location: "Toon Lagoon",
    heightRequirement: 42,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: true,
      hasAccessibleVehicle: false,
      mustTransfer: true,
      specialNotes: "River rapids ride - You will get soaked!"
    },
    userRating: null
  }
];

const RideNow: React.FC<RideNowProps> = ({ userData, onProfileUpdate }) => {
  const [lands, setLands] = useState<Land[]>([
    { 
      name: "Jurassic Park", 
      rides: RIDES.filter(ride => ride.location === "Jurassic Park").map(ride => ({
        ...ride,
        userRating: userData?.ridePreferences?.find((pref: RidePreference) => pref.rideId === ride.id)?.rating || null
      }))
    },
    { 
      name: "Marvel Super Hero Island", 
      rides: RIDES.filter(ride => ride.location === "Marvel Super Hero Island").map(ride => ({
        ...ride,
        userRating: userData?.ridePreferences?.find((pref: RidePreference) => pref.rideId === ride.id)?.rating || null
      }))
    },
    { 
      name: "Seuss Landing", 
      rides: RIDES.filter(ride => ride.location === "Seuss Landing").map(ride => ({
        ...ride,
        userRating: userData?.ridePreferences?.find((pref: RidePreference) => pref.rideId === ride.id)?.rating || null
      }))
    },
    { 
      name: "The Wizarding World of Harry Potter - Hogsmeade", 
      rides: RIDES.filter(ride => ride.location === "The Wizarding World of Harry Potter - Hogsmeade").map(ride => ({
        ...ride,
        userRating: userData?.ridePreferences?.find((pref: RidePreference) => pref.rideId === ride.id)?.rating || null
      }))
    },
    { 
      name: "Toon Lagoon", 
      rides: RIDES.filter(ride => ride.location === "Toon Lagoon").map(ride => ({
        ...ride,
        userRating: userData?.ridePreferences?.find((pref: RidePreference) => pref.rideId === ride.id)?.rating || null
      }))
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Add cooldown timer effect
  useEffect(() => {
    let timer: number | undefined;
    if (cooldownTime > 0) {
      timer = window.setInterval(() => {
        setCooldownTime(time => time - 1);
      }, 1000);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [cooldownTime]);

  // Update lands when userData changes
  useEffect(() => {
    if (userData?.ridePreferences) {
      setLands(prevLands => prevLands.map(land => ({
        ...land,
        rides: land.rides.map(ride => ({
          ...ride,
          userRating: userData.ridePreferences.find((pref: RidePreference) => pref.rideId === ride.id)?.rating || null
        }))
      })));
    }
  }, [userData]);

  const updateWaitTimes = async () => {
    if (cooldownTime > 0) return;
    
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

      // Update timestamp and set cooldown
      const now = new Date();
      setLastUpdated(
        `${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`
      );
      setCooldownTime(60); // 1 minute cooldown
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

  const handleProfileComplete = () => {
    setShowProfileEdit(false);
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Section */}
      {userData && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 rounded-full p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                <p className="text-gray-300">Height: {Math.floor(userData.height / 12)}'{userData.height % 12}"</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileEdit(true)}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Settings className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Wait Times Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Universal's Islands of Adventure</h1>
          <button
            onClick={updateWaitTimes}
            disabled={isLoading || cooldownTime > 0}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            Check Wait Times
          </button>
        </div>
        {lastUpdated && (
          <div className="text-gray-400 text-sm flex flex-col items-end gap-1">
            <span>Powered by Queue-Times.com</span>
            <span>Last updated: {lastUpdated}</span>
            {cooldownTime > 0 && (
              <span className="text-red-400">
                Next refresh available in: {Math.floor(cooldownTime / 60)}:{(cooldownTime % 60).toString().padStart(2, '0')}
              </span>
            )}
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

      {/* Profile Edit Modal */}
      {showProfileEdit && userData && (
        <ProfileSetup
          onClose={() => setShowProfileEdit(false)}
          onComplete={handleProfileComplete}
          initialData={{
            email: userData.email,
            name: userData.name,
            height: userData.height,
            ridePreferences: userData.ridePreferences
          }}
        />
      )}
    </div>
  );
};

export default RideNow;