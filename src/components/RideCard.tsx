import React, { useState } from 'react';
import type { FC, ReactElement, MouseEvent } from 'react';
import { Clock, MapPin, Frown, Meh, Smile, SmilePlus, Heart, FlipHorizontal, Ruler, Info, Accessibility } from 'lucide-react';
import { getApiUrl } from '../config';

interface Ride {
  id: number;
  name: string;
  waitTime: number | 'Closed';
  location: string;
  userRating: number | null;
  heightRequirement: number;
  thrillLevel: 1 | 2 | 3 | 4 | 5;
  features: {
    goesUpsideDown?: boolean;
    isWaterRide?: boolean;
    hasAccessibleVehicle?: boolean;
    mustTransfer?: boolean;
    specialNotes?: string;
  };
}

interface RideCardProps {
  ride: Ride;
  onRate: (id: number, rating: number) => void;
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

export default RideCard; 