import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 80,
    host: true,
    allowedHosts: [
      'ec2-3-128-221-93.us-east-2.compute.amazonaws.com'
    ]
  },
})