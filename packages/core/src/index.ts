// Entry point for @boba-cli/core

// Types
export type {
  ColorSupport,
  TerminalBackground,
  EnvironmentAdapter,
} from './types.js'

// Detection utilities
export {
  detectColorSupport,
  detectTerminalBackground,
  createAutoEnvironmentAdapter,
} from './detect.js'
