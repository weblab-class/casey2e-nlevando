// Test comment for Git tracking
import React, { useState, useEffect } from 'react';
import type { FC, ReactElement, MouseEvent } from 'react';
import { Clock, MapPin, Frown, Meh, Smile, SmilePlus, Heart, RefreshCw, Ruler, Info, Accessibility, FlipHorizontal, Settings, User, MapIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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

interface Park {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

interface RideCardProps {
  ride: Ride;
  onRate: (id: number, rating: number) => void;
}

interface RideNowProps {
  userData?: UserData;
  onProfileUpdate?: () => void;
}

const PARKS: Park[] = [
  {
    id: 'ioa',
    name: 'Islands of Adventure',
    description: 'Journey through five islands featuring cutting-edge rides and attractions',
    imageUrl: '/assets/ioalogo.png' // Updated image path
  }
];

interface IconProps {
  className?: string;
  size?: number;
}

const RideCard: FC<RideCardProps> = ({ ride, onRate }): ReactElement => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
    setIsFlipped(!isFlipped);
  };

  const getThrillLevelText = (level: number): string => {
    switch (level) {
      case 1: return "Mild - Perfect for all ages";
      case 2: return "Moderate - Some small thrills";
      case 3: return "Exciting - Moderate thrills";
      case 4: return "Thrilling - High intensity";
      case 5: return "Extreme - Maximum thrills";
      default: return "";
    }
  };

  const getRatingIcon = (rating: number, isSelected: boolean, size: number = 24): ReactElement => {
    const className = `h-${size} w-${size} ${isSelected ? 'text-yellow-400' : 'text-gray-400'} transition-colors`;
    switch (rating) {
      case 1: return <Frown className={className} />;
      case 2: return <Meh className={className} />;
      case 3: return <Smile className={className} />;
      case 4: return <SmilePlus className={className} />;
      case 5: return <Heart className={className} />;
      default: return <></>;
    }
  };

  return (
    <div 
      className="relative h-[400px] perspective-1000"
      onClick={handleClick}
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

const RideNow: FC<RideNowProps> = ({ userData, onProfileUpdate }): ReactElement => {
  const [selectedPark, setSelectedPark] = useState<string>('');
  const [showParkSelector, setShowParkSelector] = useState<boolean>(true);
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [showProfileEdit, setShowProfileEdit] = useState<boolean>(false);
  const [suggestedRide, setSuggestedRide] = useState<Ride | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((time: number) => time - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownTime]);

  useEffect(() => {
    if (userData?.ridePreferences) {
      setLands(prevLands => prevLands.map((land: Land) => ({
        ...land,
        rides: land.rides.map((ride: Ride) => ({
          ...ride,
          userRating: userData.ridePreferences.find((pref: RidePreference) => pref.rideId === ride.id)?.rating || null
        }))
      })));
    }
  }, [userData]);

  const updateWaitTimes = async (): Promise<void> => {
    if (cooldownTime > 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/queue-times');
      const data = await response.json();
      
      setLands(prevLands => prevLands.map((land: Land) => ({
        ...land,
        rides: land.rides.map((ride: Ride) => {
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

      const now = new Date();
      setLastUpdated(now);
      setCooldownTime(60);
    } catch (error) {
      console.error('Failed to fetch wait times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = (rideId: number, rating: number): void => {
    setLands(lands.map((land: Land) => ({
      ...land,
      rides: land.rides.map((ride: Ride) => 
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

  // Add the calculateRideScore function
  const calculateRideScore = (rating: number, waitTime: number | 'Closed') => {
    if (waitTime === 'Closed') return -1;
    // Rating weight: 0.7 (70% importance)
    // Wait time weight: 0.3 (30% importance)
    const ratingScore = (rating / 5) * 0.7;
    const waitTimeScore = (1 - Math.min(waitTime, 120) / 120) * 0.3; // Cap wait times at 120 minutes
    return ratingScore + waitTimeScore;
  };

  // Add the suggestNextRide function
  const suggestNextRide = () => {
    let bestRide: Ride | null = null;
    let bestScore = -1;

    // Flatten all rides from all lands
    const allRides = lands.flatMap(land => land.rides);

    allRides.forEach(ride => {
      const userRating = ride.userRating || 3; // Default to 3 if no rating
      if (typeof ride.waitTime === 'number' || ride.waitTime === 'Closed') {
        const score = calculateRideScore(userRating, ride.waitTime);
        if (score > bestScore) {
          bestScore = score;
          bestRide = ride;
        }
      }
    });

    setSuggestedRide(bestRide);
  };

  const handleParkSelect = (parkId: string): void => {
    setSelectedPark(parkId);
    setShowParkSelector(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {showParkSelector ? (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Select a Park</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARKS.map((park) => (
              <div
                key={park.id}
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => handleParkSelect(park.id)}
              >
                {park.imageUrl && (
                  <img
                    src={park.imageUrl}
                    alt={park.name}
                    className="w-full h-32 object-contain rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{park.name}</h3>
                <p className="text-gray-300">{park.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {PARKS.find(p => p.id === selectedPark)?.name}
              </h2>
              <button 
                onClick={() => setShowParkSelector(true)}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2 flex items-center gap-2"
              >
                <MapIcon size={20} />
                Change Park
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={suggestNextRide}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                <Clock className="h-5 w-5" />
                Ride Now
              </button>

              <button 
                onClick={updateWaitTimes}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                disabled={isLoading || cooldownTime > 0}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Times</span>
                {cooldownTime > 0 && (
                  <span>({Math.floor(cooldownTime / 60)}:{(cooldownTime % 60).toString().padStart(2, '0')})</span>
                )}
              </button>
            </div>
          </div>

          {/* Wait Times Info */}
          {lastUpdated && (
            <div className="text-gray-400 text-sm mb-8">
              <p>Powered by Queue-Times.com</p>
              <p>Last updated: {lastUpdated.toLocaleTimeString()} on {lastUpdated.toLocaleDateString()}</p>
            </div>
          )}

          {/* Suggested Ride */}
          {suggestedRide && (
            <div className="bg-blue-500/20 backdrop-blur-md rounded-lg p-4 mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Suggested Next Ride:</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-white">{suggestedRide.name}</p>
                  <p className="text-sm text-gray-300">Location: {suggestedRide.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-white">
                    {suggestedRide.waitTime === 'Closed' ? 'Closed' : `${suggestedRide.waitTime} min wait`}
                  </p>
                  {suggestedRide.userRating && (
                    <p className="text-sm text-gray-300">Your Rating: {suggestedRide.userRating}/5</p>
                  )}
                </div>
              </div>
            </div>
          )}

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
        </>
      )}

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