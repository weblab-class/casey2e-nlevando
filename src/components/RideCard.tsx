<div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden p-4 h-full flex flex-col">
  <h3 className="text-xl font-semibold text-white mb-4">
    {ride.name}
  </h3>
  
  {/* Logo Section */}
  <div className="flex justify-center mt-4">
    <img src="/assets/ioalogo.png" alt="Islands of Adventure Logo" className="h-20" />
  </div>

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
    {/* Other content... */}
  </div>
</div> 