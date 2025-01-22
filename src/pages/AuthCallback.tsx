import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Store the token
      localStorage.setItem('authToken', token);
      
      // Fetch user profile
      fetch(getApiUrl('/api/user/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(user => {
        // Store initial user data
        localStorage.setItem('userData', JSON.stringify(user));
        
        // Navigate based on profile completion
        if (!user.profileComplete) {
          // First store user data, then navigate
          navigate('/?setup=true', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        navigate('/', { replace: true });
      });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-white text-xl">
        Completing sign in...
      </div>
    </div>
  );
};

export default AuthCallback; 