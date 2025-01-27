// Test comment for Git tracking
import React, { useState, useEffect } from 'react';
import type { FC, ReactElement, MouseEvent } from 'react';
import { Clock, MapPin, Frown, Meh, Smile, SmilePlus, Heart, RefreshCw, Ruler, Info, Accessibility, FlipHorizontal, Settings, User, MapIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ProfileSetup from '../components/ProfileSetup';
import { getApiUrl } from '../config';

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
  hours: {
    open: string;
    close: string;
  };
}

interface RideCardProps {
  ride: Ride;
  onRate: (id: number, rating: number) => void;
}

interface RideNowProps {
  userData?: UserData;
  onProfileUpdate?: () => void;
}

// Add a type for park IDs to make it easier to add more parks
type ParkId = 'ioa' | 'usf';

// Add a type for Queue Times API IDs
interface ParkQueueTimesConfig {
  id: string;
  queueTimesId: string;
  name: string;
  description: string;
  imageUrl?: string;
  hours: {
    open: string;
    close: string;
  };
  lands: string[];
}

// Update PARKS to include all necessary configuration
const PARK_CONFIG: Record<ParkId, ParkQueueTimesConfig> = {
  'ioa': {
    id: 'ioa',
    queueTimesId: '64',
    name: 'Islands of Adventure',
    description: 'Journey through five islands featuring cutting-edge rides and attractions',
    imageUrl: '/assets/ioalogo.png',
    hours: {
      open: '9:00 AM',
      close: '7:00 PM'
    },
    lands: [
      "Jurassic Park",
      "Marvel Super Hero Island",
      "Seuss Landing",
      "The Wizarding World of Harry Potter - Hogsmeade",
      "Toon Lagoon"
    ]
  },
  'usf': {
    id: 'usf',
    queueTimesId: '63',
    name: 'Universal Studios Florida',
    description: 'Movie magic comes alive with thrilling attractions and entertainment',
    imageUrl: '/assets/usflogo.png',
    hours: {
      open: '9:00 AM',
      close: '7:00 PM'
    },
    lands: [
      "Production Central",
      "New York",
      "San Francisco",
      "The Wizarding World of Harry Potter - Diagon Alley",
      "World Expo",
      "Springfield",
      "Woody Woodpecker's KidZone"
    ]
  }
};

// Convert config to array for park selector
const PARKS = Object.values(PARK_CONFIG);

interface IconProps {
  className?: string;
  size?: number;
}

const RideCard: FC<RideCardProps> = ({ ride, onRate }): ReactElement => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
    // Don't flip if clicking on rating buttons
    if ((e.target as HTMLElement).closest('.rating-buttons')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (rating: number) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch(getApiUrl('/api/user/profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rideId: ride.id,
          rating: rating
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update rating');
      }

      const updatedUser = await response.json();
      // Update the local state with the new rating
      onRate(ride.id, rating);
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Failed to update rating. Please try again.');
    } finally {
      setIsUpdating(false);
    }
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

  const getRatingIcon = (rating: number, isSelected: boolean): ReactElement => {
    const className = `h-6 w-6 ${isSelected ? 'text-yellow-400' : 'text-gray-400'} cursor-pointer hover:text-yellow-400 transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`;
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
                <div className="flex space-x-4 rating-buttons" onClick={(e) => e.stopPropagation()}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(rating)}
                      disabled={isUpdating}
                      className="focus:outline-none disabled:cursor-not-allowed"
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
      specialNotes: "High-speed launch coaster"
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

// Add Universal Studios Florida rides
const USF_RIDES: Ride[] = [
  // Production Central
  {
    id: 101,
    name: "Hollywood Rip Ride Rockit",
    waitTime: 60,
    location: "Production Central",
    heightRequirement: 51,
    thrillLevel: 5 as const,
    features: {
      goesUpsideDown: true,
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "High-speed roller coaster with music selection"
    },
    userRating: null
  },
  {
    id: 102,
    name: "Despicable Me Minion Mayhem",
    waitTime: 45,
    location: "Production Central",
    heightRequirement: 40,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "3D motion simulator ride"
    },
    userRating: null
  },

  // New York
  {
    id: 103,
    name: "Revenge of the Mummy",
    waitTime: 35,
    location: "New York",
    heightRequirement: 48,
    thrillLevel: 4 as const,
    features: {
      goesUpsideDown: false,
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "Indoor roller coaster with special effects"
    },
    userRating: null
  },
  {
    id: 104,
    name: "Race Through New York Starring Jimmy Fallon",
    waitTime: 25,
    location: "New York",
    heightRequirement: 40,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "4D motion simulator experience"
    },
    userRating: null
  },

  // San Francisco
  {
    id: 105,
    name: "Fast & Furious - Supercharged",
    waitTime: 40,
    location: "San Francisco",
    heightRequirement: 40,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "High-speed virtual reality experience"
    },
    userRating: null
  },

  // The Wizarding World of Harry Potter - Diagon Alley
  {
    id: 106,
    name: "Harry Potter and the Escape from Gringotts",
    waitTime: 75,
    location: "The Wizarding World of Harry Potter - Diagon Alley",
    heightRequirement: 42,
    thrillLevel: 4 as const,
    features: {
      goesUpsideDown: false,
      isWaterRide: false,
      hasAccessibleVehicle: true,
      mustTransfer: true,
      specialNotes: "3D motion-based steel roller coaster dark ride"
    },
    userRating: null
  },

  // World Expo
  {
    id: 107,
    name: "MEN IN BLACK Alien Attack",
    waitTime: 30,
    location: "World Expo",
    heightRequirement: 42,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Interactive dark ride with spinning vehicles"
    },
    userRating: null
  },
  {
    id: 108,
    name: "The Simpsons Ride",
    waitTime: 35,
    location: "World Expo",
    heightRequirement: 40,
    thrillLevel: 4 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Motion simulator with Simpsons theming"
    },
    userRating: null
  },

  // Springfield
  {
    id: 109,
    name: "Kang & Kodos' Twirl 'n' Hurl",
    waitTime: 15,
    location: "Springfield",
    heightRequirement: 36,
    thrillLevel: 2 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Spinning ride with Simpsons theming"
    },
    userRating: null
  },

  // Woody Woodpecker's KidZone
  {
    id: 110,
    name: "E.T. Adventure",
    waitTime: 30,
    location: "Woody Woodpecker's KidZone",
    heightRequirement: 34,
    thrillLevel: 2 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Classic dark ride featuring E.T."
    },
    userRating: null
  },
  {
    id: 111,
    name: "Woody Woodpecker's Nuthouse Coaster",
    waitTime: 20,
    location: "Woody Woodpecker's KidZone",
    heightRequirement: 36,
    thrillLevel: 3 as const,
    features: {
      isWaterRide: false,
      hasAccessibleVehicle: true,
      specialNotes: "Family-friendly roller coaster"
    },
    userRating: null
  }
];

const RideNow: FC<RideNowProps> = ({ userData, onProfileUpdate }): ReactElement => {
  const [selectedPark, setSelectedPark] = useState<ParkId>('ioa');
  const [showParkSelector, setShowParkSelector] = useState<boolean>(true);
  const [lands, setLands] = useState<Land[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [showProfileEdit, setShowProfileEdit] = useState<boolean>(false);
  const [suggestedRide, setSuggestedRide] = useState<Ride | null>(null);
  const [runnerUpRide, setRunnerUpRide] = useState<Ride | null>(null);

  // Get current park configuration
  const currentParkConfig = PARK_CONFIG[selectedPark];

  // Initialize lands with user preferences
  useEffect(() => {
    if (!userData) return;

    const userHeight = userData.height;
    const parkRides = selectedPark === 'usf' ? USF_RIDES : RIDES;
    
    const initialLands = currentParkConfig.lands.map(landName => ({
      name: landName,
      rides: parkRides
        .filter(ride => 
          ride.location === landName && 
          ride.heightRequirement <= userHeight
        )
        .map(ride => ({
          ...ride,
          userRating: userData.ridePreferences?.find(pref => pref.rideId === ride.id)?.rating || null
        }))
    })).filter(land => land.rides.length > 0);

    setLands(initialLands);
  }, [userData, selectedPark]);

  useEffect(() => {
    console.log('Cooldown timer changed:', cooldownTime); // Debug log
    let timer: ReturnType<typeof setInterval> | undefined;
    if (cooldownTime > 0) {
      console.log('Starting cooldown interval'); // Debug log
      timer = setInterval(() => {
        setCooldownTime((time: number) => {
          console.log('Updating cooldown time:', time - 1); // Debug log
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        console.log('Clearing cooldown interval'); // Debug log
        clearInterval(timer);
      }
    };
  }, [cooldownTime]);

  const updateWaitTimes = async (): Promise<void> => {
    console.log('updateWaitTimes called');
    if (!userData) {
      console.log('No user data, returning');
      return;
    }
    const userHeight = userData.height;
    
    setIsLoading(true);
    try {
      const endpoint = `/api/queue-times/${currentParkConfig.queueTimesId}`;
      console.log('Fetching from:', getApiUrl(endpoint));
      const response = await fetch(getApiUrl(endpoint));
      if (!response.ok) throw new Error('Failed to fetch wait times');
      
      const data = await response.json();
      console.log('Queue Times API Response:', data);
      
      const parkRides = selectedPark === 'usf' ? USF_RIDES : RIDES;
      
      const updatedLands = currentParkConfig.lands.map(landName => ({
        name: landName,
        rides: parkRides
          .filter(ride => ride.location === landName && ride.heightRequirement <= userHeight)
          .map(ride => {
            // Find the matching ride in the API response
            const apiRide = data.lands
              ?.flatMap((l: any) => l.rides || [])
              ?.find((r: any) => {
                const apiName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const rideName = ride.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                return apiName.includes(rideName) || rideName.includes(apiName);
              });

            console.log(`Matching ride ${ride.name}:`, apiRide); // Debug log

            return {
              ...ride,
              waitTime: apiRide?.is_open ? apiRide.wait_time : 'Closed',
              userRating: userData.ridePreferences?.find(pref => pref.rideId === ride.id)?.rating || null
            };
          })
      })).filter(land => land.rides.length > 0);

      setLands(updatedLands);
      const now = new Date();
      setLastUpdated(now);
      if (!suggestNextRide.caller) {
        console.log('Setting cooldown timer'); // Debug log
        setCooldownTime(60);
      }
    } catch (error) {
      console.error('Failed to fetch wait times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRideRating = (rideId: number, rating: number) => {
    // Update local state
    setLands(prevLands => prevLands.map(land => ({
      ...land,
      rides: land.rides.map(ride => 
        ride.id === rideId ? { ...ride, userRating: rating } : ride
      )
    })));

    // Also update the suggested rides if they exist
    if (suggestedRide?.id === rideId) {
      setSuggestedRide(prev => prev ? { ...prev, userRating: rating } : null);
    }
    if (runnerUpRide?.id === rideId) {
      setRunnerUpRide(prev => prev ? { ...prev, userRating: rating } : null);
    }
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

  // Add effect to fetch initial wait times when park is selected
  useEffect(() => {
    if (!showParkSelector && userData) {
      updateWaitTimes();
    }
  }, [showParkSelector, selectedPark]);

  const handleParkSelect = (parkId: ParkId): void => {
    setSelectedPark(parkId);
    setShowParkSelector(false);
    // Reset states when changing parks
    setSuggestedRide(null);
    setRunnerUpRide(null);
    setLastUpdated(null);
    setCooldownTime(0);
  };

  // Update the suggestNextRide function to ensure it updates wait times
  const suggestNextRide = async () => {
    if (!userData) return;
    
    try {
      // First update wait times
      await updateWaitTimes();
      
      const parkRides = selectedPark === 'usf' ? USF_RIDES : RIDES;
      const allRidesWithUpdatedTimes = lands.flatMap(land => land.rides);

      // Find best rides using the fresh data
      let bestRide: Ride | null = null;
      let runnerUpRide: Ride | null = null;
      let bestScore = -1;
      let secondBestScore = -1;

      allRidesWithUpdatedTimes.forEach(ride => {
        const userRating = ride.userRating || 3;
        if (typeof ride.waitTime === 'number' || ride.waitTime === 'Closed') {
          const score = calculateRideScore(userRating, ride.waitTime);
          if (score > bestScore) {
            runnerUpRide = bestRide;
            secondBestScore = bestScore;
            bestScore = score;
            bestRide = ride;
          } else if (score > secondBestScore) {
            secondBestScore = score;
            runnerUpRide = ride;
          }
        }
      });

      setSuggestedRide(bestRide);
      setRunnerUpRide(runnerUpRide);
    } catch (error) {
      console.error('Failed to suggest next ride:', error);
    }
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
                onClick={() => handleParkSelect(park.id as ParkId)}
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
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {PARKS.find(p => p.id === selectedPark)?.name}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => setShowParkSelector(true)}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
                >
                  <MapIcon size={20} />
                  Change Park
                </button>
                <span className="text-gray-300 text-sm flex items-center gap-2">
                  <Clock size={16} className="text-blue-400" />
                  Hours: {PARKS.find(p => p.id === selectedPark)?.hours.open} - {PARKS.find(p => p.id === selectedPark)?.hours.close}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={suggestNextRide}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  <Clock className="h-5 w-5" />
                  Ride Now
                </button>

                <button 
                  onClick={() => {
                    console.log('Refresh button clicked'); // Debug log
                    console.log('isLoading:', isLoading); // Debug log
                    console.log('cooldownTime:', cooldownTime); // Debug log
                    updateWaitTimes();
                  }}
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

              {/* Wait Times Info */}
              {lastUpdated && (
                <div className="text-right">
                  <p className="text-blue-400 font-medium">Powered by Queue-Times.com</p>
                  <p className="text-gray-400 text-sm">Last updated: {lastUpdated.toLocaleTimeString()} on {lastUpdated.toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Rides */}
          {suggestedRide && (
            <div className="bg-blue-500/20 backdrop-blur-md rounded-lg p-4 mb-8 space-y-4">
              {/* Best Suggestion */}
              <div>
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

              {/* Runner Up */}
              {runnerUpRide && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Runner Up:</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg text-white">{runnerUpRide.name}</p>
                      <p className="text-sm text-gray-300">Location: {runnerUpRide.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-white">
                        {runnerUpRide.waitTime === 'Closed' ? 'Closed' : `${runnerUpRide.waitTime} min wait`}
                      </p>
                      {runnerUpRide.userRating && (
                        <p className="text-sm text-gray-300">Your Rating: {runnerUpRide.userRating}/5</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lands and Rides Grid */}
          {lands.map((land) => (
            <div key={land.name} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{land.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {land.rides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} onRate={handleRideRating} />
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