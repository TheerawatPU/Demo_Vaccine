import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "/Demo_Vaccine/",
  plugins: [
    tailwindcss(),
  ],
})