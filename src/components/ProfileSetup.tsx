import React, { useState, ReactElement } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getApiUrl } from '../config';

interface ProfileSetupProps {
  onClose: () => void;
  onComplete: () => void;
  initialData: {
    email: string;
    name: string;
    height?: number;
    ridePreferences?: { rideId: number; rating: number; }[];
  };
}

interface FormData {
  name: string;
  height: string;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onClose, onComplete, initialData }) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name,
    height: initialData.height?.toString() || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      // Log what we're about to send
      console.log('Sending profile update:', {
        name: formData.name,
        height: parseInt(formData.height)
      });

      const response = await fetch(getApiUrl('/api/user/profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          height: parseInt(formData.height)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      const updatedUser = await response.json();
      console.log('Received updated user:', updatedUser);

      // Only update name and height in localStorage
      const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('userData', JSON.stringify({
        ...existingData,
        name: formData.name,
        height: parseInt(formData.height),
        profileComplete: true
      }));

      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    console.log('[ProfileSetup] Starting save...');
    if (!formData.name || !formData.height) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No auth token found');
        return;
      }

      // Only send name and height in the update request
      const response = await fetch(getApiUrl('/api/user/profile'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          height: formData.height
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      console.log('[ProfileSetup] Save successful, storing user data...');
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          disabled={isSaving}
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {initialData.height ? 'Edit Profile' : 'Complete Your Profile'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={isSaving}
              />
            </div>

            {/* Height Input */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (in inches)
              </label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="36"
                max="84"
                disabled={isSaving}
              />
              <p className="mt-1 text-sm text-gray-500">
                Example: 60 for 5 feet, 72 for 6 feet
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-colors flex items-center justify-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 