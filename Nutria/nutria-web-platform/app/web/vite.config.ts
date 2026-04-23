import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const apiPort = process.env.NUTRIA_API_PORT ?? '3001';

export default defineConfig(({ command }) => ({
  /** GitHub project page: production build is served at /nutria/; dev uses `/` for simple localhost. */
  base: command === 'build' ? '/nutria/' : '/',
  plugins: [
    react(),
    {
      name: 'nutria-api-hint',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          console.log(
            `\n  Nutria: API proxy → http://127.0.0.1:${apiPort}  (set NUTRIA_API_PORT if server uses another port)\n` +
              '  Start both:  cd nutria-web-platform && npm run dev\n\n',
          );
        });
      },
    },
  ],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': { target: `http://127.0.0.1:${apiPort}`, changeOrigin: true },
    },
  },
}));
