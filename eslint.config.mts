import * as eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'

import * as tsdocPlugin from 'eslint-plugin-tsdoc'
import tseslint from 'typescript-eslint'

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- plugin has no types
      tsdoc: tsdocPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'tsdoc/syntax': 'warn',
    },
  },
  {
    ignores: [
      '**/test/**',
      '**/vitest.config.*',
      'commitlint.config.cjs',
      'tools/demo-site/**',
    ],
  },
  {
    files: ['scripts/**/*.mts'],
  },
)
