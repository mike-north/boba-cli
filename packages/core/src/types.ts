/**
 * Color support levels for terminal output.
 * @public
 */
export interface ColorSupport {
  /** The maximum color level supported (0-3). */
  readonly level: number
  /** Whether basic 16-color support is available. */
  readonly hasBasic: boolean
  /** Whether 256-color support is available. */
  readonly has256: boolean
  /** Whether 16 million (true color) support is available. */
  readonly has16m: boolean
}

/**
 * Terminal background mode.
 * @public
 */
export type TerminalBackground = 'dark' | 'light' | 'unknown'

/**
 * Environment adapter interface for platform-agnostic environment access.
 * @public
 */
export interface EnvironmentAdapter {
  /**
   * Get an environment variable value.
   * @param name - Variable name
   * @returns Variable value or undefined
   */
  get(name: string): string | undefined

  /**
   * Get color support level.
   * @returns Color support information
   */
  getColorSupport(): ColorSupport

  /**
   * Detect terminal background mode.
   * @returns Background mode (dark, light, or unknown)
   */
  getTerminalBackground(): TerminalBackground
}
