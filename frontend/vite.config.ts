import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env from root
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  console.log('Loaded env:', env)

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    define: {
      // Optional if you want to expose as a constant, but normally VITE_ vars work directly
      __VITE_API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
