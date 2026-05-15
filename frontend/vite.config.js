import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  
  server: {
    host: '0.0.0.0',   // bind to all interfaces so Docker port mapping works
    port: 3000,
    open: false,        // don't try to open a browser inside the container
    proxy: {
      '/api': {
        // In Docker dev the backend is reachable via the service name.
        // Set BACKEND_URL=http://backend:5000 in docker-compose environment.
        // Falls back to localhost for running outside Docker.
        target: process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  build: {
    outDir: 'build',
    sourcemap: false,
  }
})
