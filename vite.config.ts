import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_',
  // Ensure .env.local is loaded first
  envDir: process.cwd(),
  server: {
    port: 5173,
    // Add open: true to automatically open browser
    open: true,
    // Force clear terminal on restart
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
