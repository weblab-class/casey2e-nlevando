// Environment-specific configuration
const isDevelopment = import.meta.env.MODE === 'development';
const BASE_URL = isDevelopment ? 'http://localhost:5000' : 'https://thrillcompass.onrender.com';
const CLIENT_URL = isDevelopment ? 'http://localhost:3000' : 'https://thrillcompass.onrender.com';

// Configuration interface
export interface Config {
  apiUrl: string;
  debug: boolean;
  googleAuthUrl: string;
  googleCallbackUrl: string;
  clientUrl: string;
}

// Configuration object
export const config: Config = {
  apiUrl: BASE_URL,
  debug: isDevelopment,
  googleAuthUrl: `${BASE_URL}/api/auth/google`,
  googleCallbackUrl: `${BASE_URL}/api/auth/google/callback`,
  clientUrl: CLIENT_URL
};

// Helper function to get full API URL
export const getApiUrl = (path?: string): string => path ? `${config.apiUrl}${path}` : config.apiUrl;

// Log configuration in development
if (config.debug) {
  console.log('[CONFIG] App configuration:', {
    apiUrl: config.apiUrl,
    googleAuthUrl: config.googleAuthUrl,
    googleCallbackUrl: config.googleCallbackUrl,
    clientUrl: config.clientUrl,
    isDevelopment,
    mode: import.meta.env.MODE
  });
}

export default config; 