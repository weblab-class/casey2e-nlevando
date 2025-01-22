import React from 'react';
import { Clock, ThumbsUp, Map } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl space-y-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Skip the Lines,<br />
            <span className="text-blue-400">Maximize the Thrills</span>
          </h1>
          <p className="text-xl text-gray-300">
            Navigate Universal Orlando's Islands of Adventure like a pro with real-time wait times and personalized ride recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="h-6 w-6 text-blue-400" />
              <span>Real-time Wait Times</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ThumbsUp className="h-6 w-6 text-blue-400" />
              <span>Personalized Recommendations</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Map className="h-6 w-6 text-blue-400" />
              <span>Smart Navigation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/10 backdrop-blur-md py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real-time Wait Times */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full p-4 inline-block">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Real-time Wait Times</h3>
              <p className="mt-2 text-gray-300">
                Stay updated with accurate wait times for all rides and attractions.
              </p>
            </div>

            {/* Personalized Recommendations */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full p-4 inline-block">
                <ThumbsUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Smart Recommendations</h3>
              <p className="mt-2 text-gray-300">
                Get ride suggestions based on your preferences and current wait times.
              </p>
            </div>

            {/* Smart Navigation */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full p-4 inline-block">
                <Map className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Optimal Routes</h3>
              <p className="mt-2 text-gray-300">
                Follow optimized paths to minimize walking and waiting time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;