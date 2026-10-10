import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3300,
    host: true,
    strictPort: true,
    proxy: {
      '/proxy/platform': {
        target: 'http://127.0.0.1:3100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/platform/, ''),
      },
      '/proxy/routing': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/routing/, ''),
      },
      '/proxy/sandbox': {
        target: 'http://127.0.0.1:3007',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/sandbox/, ''),
      },
      '/proxy/intelligence': {
        target: 'http://127.0.0.1:3200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/intelligence/, ''),
      },
      '/proxy/ecommerce': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/ecommerce/, ''),
      },
    },
  },
});
