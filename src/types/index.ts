export interface Ride {
  id: number;
  name: string;
  waitTime: number;
  location: string;
  userRating: number | null;
}

export interface LoginProps {
  onClose: () => void;
  onLogin: () => void;
}

export interface LandingProps {
  onGetStarted: () => void;
} 