import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // make sure assets load from the root
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // default for Vite, but explicit is good
  },
})
