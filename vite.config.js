import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/weather/',
  build: {
    outDir: 'docs'
  },
  plugins: [react()],
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/weather/",
  plugins: [react()],
})
