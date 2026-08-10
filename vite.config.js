import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. เพิ่มบรรทัดนี้
import { Analytics } from "@vercel/analytics/next"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. เพิ่มบรรทัดนี้
  ],
})