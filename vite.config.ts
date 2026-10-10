import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8300,
    host: true,
    strictPort: true,
    proxy: {
      '/proxy/platform': {
        target: 'http://127.0.0.1:8100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/platform/, ''),
      },
      '/proxy/routing': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/routing/, ''),
      },
      '/proxy/sandbox': {
        target: 'http://127.0.0.1:8500',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/sandbox/, ''),
      },
      '/proxy/intelligence': {
        target: 'http://127.0.0.1:8200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/intelligence/, ''),
      },
      '/proxy/optimizer': {
        target: 'http://127.0.0.1:8200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/optimizer/, ''),
      },
      '/proxy/ecommerce': {
        target: 'http://127.0.0.1:8401',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/ecommerce/, ''),
      },
    },
  },
});
