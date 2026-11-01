import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: { format: 'iife' },
    },
  },
})
