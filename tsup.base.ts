import type { Options } from 'tsup'

/**
 * Base tsup configuration for all packages.
 * Generates both ESM and CJS builds with proper type declarations.
 */
export const baseConfig: Options = {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  splitting: false,
  treeshake: true,
  shims: true,
}
