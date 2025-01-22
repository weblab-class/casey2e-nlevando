import React from 'react';
import { Clock, ThumbsUp, Map, ArrowDown } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Dodge the Lines,<br />
            <span className="text-blue-400">Ride your way!</span>
          </h1>
          <p className="text-xl text-gray-300">
            Navigate parks like a pro. Made with care by park enthusiasts.<br />
            New features coming soon!
          </p>

          {/* Logo Section */}
          <div className="flex justify-center mt-6">
            <img src="/assets/tclogo.png" alt="Thrill Compass Logo" className="h-24" />
          </div>

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
      <div className="bg-white/10 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Get ride suggestions <strong>based on your preferences</strong> and current wait times.
              </p>
            </div>

            {/* Smart Navigation */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full p-4 inline-block">
                <Map className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">Optimal Routes: COMING SOON!</h3>
              <p className="mt-2 text-gray-300">
                Follow optimized paths to minimize walking and waiting time. Factors your location, wait times, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Down Arrow */}
      <div className="flex justify-center my-2">
        <ArrowDown className="h-8 w-8 text-blue-400 animate-bounce" />
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-gray-300 py-4 text-center">
        <p>
          🚧 MVP version. Many changes coming soon. 🚧
        </p>
        <p>
          Created by Casey Tewey and Nathan Levandoske for weblab @ MIT. Times powered by 
          <a href="https://queue-times.com/" className="text-blue-400 hover:underline"> queue-times.com </a> 
          and icons from Lucid React Icon library. ThrillCompass logo and TC logo made by Casey in Figma.
        </p>
        <p>
          See Readme for more details about framework and technology used in production.
        </p>
      </footer>
    </div>
  );
};

export default Landing;