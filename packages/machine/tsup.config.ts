import { defineConfig } from 'tsup'
import { baseConfig } from '../../tsup.base.js'

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts', 'src/node/index.ts', 'src/browser/index.ts'],
})
