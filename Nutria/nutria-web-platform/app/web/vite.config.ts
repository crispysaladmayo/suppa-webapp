import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'nutria-api-hint',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          console.log(
            '\n  Nutria: pastikan API jalan di :3001 (jalankan `npm run dev` di root monorepo, atau `npm run dev -w app/server`).\n',
          );
        });
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true },
    },
  },
});
