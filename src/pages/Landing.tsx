import React from 'react';
import { Clock, ThumbsUp, Map } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
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
          <button
            onClick={onGetStarted}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started
          </button>
          <div className="mt-8">
            <button
              onClick={onGetStarted}
              className="bg-transparent border-none p-0 cursor-pointer"
            >
              <img 
                src="/assets/tclogo.png" 
                alt="Theme Crew Logo" 
                className="h-20 mx-auto opacity-75 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/5 backdrop-blur-md py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Wait Times</h3>
              <p className="text-gray-300">Stay updated with accurate wait times for every attraction</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
                <Map className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Navigation</h3>
              <p className="text-gray-300">Get optimized routes based on your preferences</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
                <ThumbsUp className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Personalized Recommendations</h3>
              <p className="text-gray-300">Receive custom suggestions based on your thrill preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;