import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Ensure a single React instance (project lists react as an optional peer
    // dep, so the bundler can otherwise resolve a second copy → "Invalid hook
    // call" with libraries that use hooks).
    dedupe: ['react', 'react-dom'],
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep the stable React core in its own long-cached chunk so app-code
        // updates don't invalidate it. (recharts stays auto-split per route.)
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
        },
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
