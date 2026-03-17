import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/may-app/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html') // Vite сам найдет main.js через index.html
      },
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: false,
    watch: {
      usePolling: true,
      interval: 100,
    },
  }
})