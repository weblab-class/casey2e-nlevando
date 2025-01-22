import React, { useState } from 'react';

interface RidePreference {
  rideId: number;
  rating: number;
}

interface UserData {
  ridePreferences?: RidePreference[];
}

interface RideNowProps {
  userData: UserData | null;
}

interface Ride {
  id: number;
  name: string;
  waitTime?: number;
}

interface QueueTimeRide {
  name: string;
  wait_time: number;
}

interface QueueTimeLand {
  name: string;
  rides: QueueTimeRide[];
}

interface QueueTimeResponse {
  lands: QueueTimeLand[];
}

const RIDES: Ride[] = [
  { id: 1, name: "Jurassic World VelociCoaster" },
  { id: 2, name: "Hagrid's Magical Creatures Motorbike Adventure" },
  { id: 3, name: "Harry Potter and the Forbidden Journey" },
  { id: 4, name: "The Amazing Adventures of Spider-Man" },
  { id: 5, name: "Jurassic Park River Adventure" },
  { id: 6, name: "Doctor Doom's Fearfall" },
  { id: 7, name: "The Incredible Hulk Coaster" },
  { id: 8, name: "Popeye & Bluto's Bilge-Rat Barges" },
  { id: 9, name: "Dudley Do-Right's Ripsaw Falls" },
  { id: 10, name: "The High in the Sky Seuss Trolley Train Ride" },
  { id: 11, name: "One Fish, Two Fish, Red Fish, Blue Fish" },
  { id: 12, name: "Caro-Seuss-el" },
  { id: 13, name: "The Cat in the Hat" },
  { id: 14, name: "Flight of the Hippogriff" },
  { id: 15, name: "Storm Force Accelatron" },
  { id: 16, name: "Pteranodon Flyers" }
];

const calculateRideScore = (rating: number, waitTime: number) => {
  // Rating weight: 0.7 (70% importance)
  // Wait time weight: 0.3 (30% importance)
  // For wait times, we use an inverse relationship - longer waits reduce the score
  const ratingScore = (rating / 5) * 0.7;
  const waitTimeScore = (1 - Math.min(waitTime, 120) / 120) * 0.3; // Cap wait times at 120 minutes
  return ratingScore + waitTimeScore;
};

const RideNow: React.FC<RideNowProps> = ({ userData }) => {
  // ... existing state ...
  const [suggestedRide, setSuggestedRide] = useState<string | null>(null);

  const suggestNextRide = async () => {
    try {
      const response = await fetch('/api/queue-times');
      const data = await response.json() as QueueTimeResponse;
      
      let bestRide: string | null = null;
      let bestScore = -1;

      RIDES.forEach((ride: Ride) => {
        const userRating = userData?.ridePreferences?.find(
          (pref: RidePreference) => pref.rideId === ride.id
        )?.rating || 3;

        const waitTimeData = data.lands
          .flatMap((land: QueueTimeLand) => land.rides)
          .find((r: QueueTimeRide) => r.name.toLowerCase().includes(ride.name.toLowerCase()));

        const waitTime = waitTimeData?.wait_time || 0;
        const score = calculateRideScore(userRating, waitTime);

        if (score > bestScore) {
          bestScore = score;
          bestRide = ride.name;
        }
      });

      setSuggestedRide(bestRide);
    } catch (error) {
      console.error('Error suggesting next ride:', error);
    }
  };

  // ... existing JSX ...

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Islands of Adventure</h1>
      
      {/* Add Suggest Next Ride button and display */}
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={suggestNextRide}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition-colors mb-4"
        >
          Suggest Next Ride
        </button>
        {suggestedRide && (
          <div className="text-center p-4 bg-purple-100 rounded-lg shadow">
            <p className="text-lg font-semibold mb-2">Recommended Next Ride:</p>
            <p className="text-2xl text-purple-600">{suggestedRide}</p>
          </div>
        )}
      </div>

      {/* Existing ride display code */}
      <div className="flex justify-between items-center mb-6">
        // ... rest of the existing code ...
      </div>
    </div>
  );
};

export default RideNow; 