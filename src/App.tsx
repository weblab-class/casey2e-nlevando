import React from 'react';
import { useState } from 'react';
import { LogIn, LogOut, Menu, X } from 'lucide-react';
import Landing from './pages/Landing';
import RideNow from './pages/RideNow';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/assets/thrillcompasslogo.png" alt="ThrillCompass" className="h-16 w-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <>
                    <button onClick={handleLogout} className="text-white hover:text-blue-400 flex items-center">
                      <LogOut className="h-5 w-5 mr-1" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowLogin(true)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Login
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-400"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {isLoggedIn ? (
          <RideNow />
        ) : (
          <Landing onGetStarted={() => setShowLogin(true)} />
        )}
      </main>

      {/* Login Modal */}
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;