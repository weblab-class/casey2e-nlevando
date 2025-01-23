import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Menu, X, User } from 'lucide-react';
import { getApiUrl } from './config';
import Landing from './pages/Landing';
import RideNow from './pages/RideNow';
import AuthModal from './components/AuthModal';
import AuthCallback from './pages/AuthCallback';
import ProfileSetup from './components/ProfileSetup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams(location.search);
    const shouldShowSetup = params.get('setup') === 'true';

    if (token) {
      // Try to get cached user data first
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        const user = JSON.parse(cachedUserData);
        setUserData(user);
        setIsLoggedIn(true);
        
        // Only show setup if explicitly requested via URL or if profile is not complete
        if (shouldShowSetup || !user.profileComplete) {
          setShowProfileSetup(true);
        }
      }

      // Then fetch fresh data
      fetchUserProfile(token);
    } else {
      // Clear state if no token
      setIsLoggedIn(false);
      setUserData(null);
      setShowProfileSetup(false);
    }
  }, [location.search]); // Only depend on location.search

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(getApiUrl('/api/user/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        setUserData(user);
        setIsLoggedIn(true);
        localStorage.setItem('userData', JSON.stringify(user));
        
        const params = new URLSearchParams(location.search);
        const shouldShowSetup = params.get('setup') === 'true';
        
        // Only show setup if explicitly requested via URL or if profile is not complete
        if (shouldShowSetup && !user.profileComplete) {
          setShowProfileSetup(true);
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      handleLogout();
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  const handleProfileComplete = () => {
    console.log('[App] Profile complete handler called');
    setShowProfileSetup(false);
    // Remove setup parameter from URL
    navigate('/', { replace: true });
    // Refresh user data
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('[App] Refreshing user data...');
      fetchUserProfile(token);
    }
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
                    <span className="text-white">Welcome, {userData?.name}</span>
                    <button 
                      onClick={() => setShowProfileSetup(true)}
                      className="text-white hover:text-blue-400 flex items-center"
                    >
                      <User className="h-5 w-5 mr-1" />
                      Edit Profile
                    </button>
                    <button onClick={handleLogout} className="text-white hover:text-blue-400 flex items-center">
                      <LogOut className="h-5 w-5 mr-1" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowAuth(true)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Sign in with Google
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
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoggedIn ? (
                <>
                  <div className="text-white px-3 py-2">{userData?.name}</div>
                  <button
                    onClick={() => setShowProfileSetup(true)}
                    className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    <User className="h-5 w-5 mr-1 inline" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    <LogOut className="h-5 w-5 mr-1 inline" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-white hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogIn className="h-5 w-5 mr-1 inline" />
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <Routes>
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/" element={
          <main>
            {isLoggedIn ? (
              <RideNow 
                userData={userData} 
                onProfileUpdate={() => {
                  const token = localStorage.getItem('authToken');
                  if (token) fetchUserProfile(token);
                }}
              />
            ) : (
              <Landing />
            )}
          </main>
        } />
      </Routes>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}

      {/* Profile Setup Modal */}
      {showProfileSetup && userData && (
        <ProfileSetup
          onClose={() => setShowProfileSetup(false)}
          onComplete={handleProfileComplete}
          initialData={{
            email: userData.email,
            name: userData.name,
            height: userData.height
          }}
        />
      )}
    </div>
  );
}

export default App;