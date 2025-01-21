import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Development server settings
    port: parseInt(process.env.PORT) || 3000,
    host: true,
    proxy: {
      '/api/queue-times': {
        target: 'https://queue-times.com/parks/64/queue_times.json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/queue-times/, ''),
      },
    },
  },
  preview: {
    // Preview server settings (for local preview only)
    port: parseInt(process.env.PORT) || 4173,
    host: true,
  }
});
