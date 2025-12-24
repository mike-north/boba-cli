import { defineConfig } from 'vitest/config'
import * as path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/*': path.resolve(__dirname, 'src/*'),
    },
  },
  test: {
    // Node tests run with node environment (default)
    // Browser tests use happy-dom environment
    include: ['test/**/*.test.ts'],
    // Configure environment based on file pattern
    // Note: environmentMatchGlobs is supported by Vitest but not yet in TypeScript definitions
    environmentMatchGlobs: [
      ['test/browser/**', 'happy-dom'],
      ['test/node/**', 'node'],
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
})
