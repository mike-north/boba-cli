import type { ColorSupport, TerminalBackground } from './types.js'

/**
 * Detect color support from environment variables.
 * Works in Node.js by accessing globalThis.process.env without Node-specific imports.
 * Returns no color support in non-Node environments (browser should provide its own detection).
 *
 * @returns Color support information
 * @public
 */
export function detectColorSupport(): ColorSupport {
  // Check if we're in a Node.js environment
  const g = globalThis as Record<string, unknown>
  const proc = g['process'] as
    | { env?: Record<string, string | undefined>; stdout?: { isTTY?: boolean } }
    | undefined

  if (!proc?.env) {
    // Not in Node.js - assume no colors (browser should use platform adapter)
    return { level: 0, hasBasic: false, has256: false, has16m: false }
  }

  const env = proc.env

  // Check for explicit NO_COLOR
  if (env['NO_COLOR'] !== undefined) {
    return { level: 0, hasBasic: false, has256: false, has16m: false }
  }

  // Check for explicit FORCE_COLOR
  const forceColor = env['FORCE_COLOR']
  if (forceColor !== undefined) {
    const level = forceColor === '' ? 1 : parseInt(forceColor, 10)
    if (!isNaN(level) && level >= 0) {
      return {
        level: Math.min(level, 3),
        hasBasic: level >= 1,
        has256: level >= 2,
        has16m: level >= 3,
      }
    }
  }

  // Check COLORTERM for true color support
  const colorTerm = env['COLORTERM']?.toLowerCase()
  if (colorTerm === 'truecolor' || colorTerm === '24bit') {
    return { level: 3, hasBasic: true, has256: true, has16m: true }
  }

  // Check TERM for 256 color support
  const term = env['TERM']?.toLowerCase() ?? ''
  if (term.includes('256color') || term.includes('256-color')) {
    return { level: 2, hasBasic: true, has256: true, has16m: false }
  }

  // Check for basic color terminals
  if (
    term.includes('color') ||
    term.includes('ansi') ||
    term.includes('xterm') ||
    term.includes('vt100') ||
    term.includes('screen') ||
    term.includes('linux')
  ) {
    return { level: 1, hasBasic: true, has256: false, has16m: false }
  }

  // Check CI environments
  if (env['CI']) {
    return { level: 1, hasBasic: true, has256: false, has16m: false }
  }

  // Check if we have a TTY
  if (proc.stdout?.isTTY) {
    return { level: 1, hasBasic: true, has256: false, has16m: false }
  }

  // No color support detected
  return { level: 0, hasBasic: false, has256: false, has16m: false }
}

/**
 * Detect terminal background from environment variables.
 * Works in Node.js by accessing globalThis.process.env without Node-specific imports.
 *
 * @returns Terminal background mode
 * @public
 */
export function detectTerminalBackground(): TerminalBackground {
  const g = globalThis as Record<string, unknown>
  const proc = g['process'] as
    | { env?: Record<string, string | undefined> }
    | undefined

  if (!proc?.env) {
    return 'unknown'
  }

  const env = proc.env

  // COLORFGBG is the most reliable indicator when present
  const colorFgBg = env['COLORFGBG']
  if (colorFgBg) {
    const parts = colorFgBg.split(';')
    const bg = parseInt(parts[parts.length - 1] ?? '', 10)
    if (!isNaN(bg)) {
      return bg < 7 || (bg >= 8 && bg < 16 && bg !== 15) ? 'dark' : 'light'
    }
  }

  // Some terminals set TERM_BACKGROUND directly
  const termBackground = env['TERM_BACKGROUND']?.toLowerCase()
  if (termBackground === 'dark' || termBackground === 'light') {
    return termBackground
  }

  // Default to dark (most common)
  return 'dark'
}

/**
 * Create an EnvironmentAdapter that auto-detects from the current environment.
 * This is useful for Node.js environments where you want automatic detection
 * without needing to create a full platform adapter.
 *
 * @returns An EnvironmentAdapter with auto-detected color support
 * @public
 */
export function createAutoEnvironmentAdapter(): import('./types.js').EnvironmentAdapter {
  const colorSupport = detectColorSupport()
  return {
    get: (name: string) => {
      const g = globalThis as Record<string, unknown>
      const proc = g['process'] as
        | { env?: Record<string, string | undefined> }
        | undefined
      return proc?.env?.[name]
    },
    getColorSupport: () => colorSupport,
    getTerminalBackground: detectTerminalBackground,
  }
}
