import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite dev server config for GitHub Codespaces / containers
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // listen on 0.0.0.0
    port: 5173,
    hmr: { clientPort: 443 } // HMR over HTTPS tunnel
  }
})
