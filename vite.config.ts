import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/queue-times': {
        target: 'https://queue-times.com/parks/64/queue_times.json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/queue-times/, ''),
      },
    },
  },
});
