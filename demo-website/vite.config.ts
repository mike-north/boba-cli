import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages deployment
  // Will be set via environment variable during build
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Externalize Node.js-only modules that are dynamically imported
      // The machine package's detect.ts uses dynamic imports that are guarded
      // by runtime environment checks, so these will never actually load
      external: [/^@boba-cli\/machine\/node/, /^node:/],
    },
  },
  optimizeDeps: {
    // Exclude Node-only dependencies from Vite's dependency optimization
    // These are optional peer dependencies of @boba-cli/machine that are
    // only used in Node.js environments (not in browser demos)
    exclude: ['unzipper', 'archiver', 'clipboardy', 'supports-color'],
  },
  resolve: {
    // Deduplicate workspace packages to ensure single module instances
    // This is critical for shared state like setDefaultContext() to work
    // across the demo-website and the component packages
    dedupe: ['@boba-cli/chapstick', '@boba-cli/machine', '@boba-cli/tea'],
    // Stub out Node.js-only packages for browser compatibility
    alias: {
      'supports-color': '/src/stubs/supports-color.ts',
    },
  },
  server: {
    port: 3000,
  },
})
