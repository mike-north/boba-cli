import type {
  ColorSupport,
  EnvironmentAdapter,
  TerminalBackground,
} from '../types.js'

/**
 * Browser environment adapter.
 * Provides sensible defaults for browser environments.
 * @public
 */
export class BrowserEnvironmentAdapter implements EnvironmentAdapter {
  private readonly envOverrides: Map<string, string>
  private colorSupportCached: ColorSupport | null = null
  private backgroundCached: TerminalBackground | null = null

  /**
   * Create a new browser environment adapter.
   * @param envOverrides - Optional environment variable overrides
   */
  constructor(envOverrides: Record<string, string> = {}) {
    this.envOverrides = new Map(Object.entries(envOverrides))
  }

  get(name: string): string | undefined {
    // Check overrides first
    if (this.envOverrides.has(name)) {
      return this.envOverrides.get(name)
    }

    // In browsers, environment variables are not available
    return undefined
  }

  /**
   * Set an environment variable override.
   * @param name - Variable name
   * @param value - Variable value
   */
  set(name: string, value: string): void {
    this.envOverrides.set(name, value)
    // Clear caches that depend on env vars
    this.colorSupportCached = null
    this.backgroundCached = null
  }

  getColorSupport(): ColorSupport {
    if (this.colorSupportCached) {
      return this.colorSupportCached
    }

    // Modern browsers and xterm.js support true color
    const support: ColorSupport = {
      level: 3,
      hasBasic: true,
      has256: true,
      has16m: true,
    }

    this.colorSupportCached = support
    return support
  }

  getTerminalBackground(): TerminalBackground {
    if (this.backgroundCached) {
      return this.backgroundCached
    }

    // Check for overrides
    const override = this.envOverrides.get('TERM_BACKGROUND')?.toLowerCase()
    if (override === 'dark' || override === 'light') {
      this.backgroundCached = override
      return override
    }

    // Try to detect from CSS media query
    if (typeof window !== 'undefined' && window.matchMedia) {
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
      if (darkQuery.matches) {
        this.backgroundCached = 'dark'
        return 'dark'
      }

      const lightQuery = window.matchMedia('(prefers-color-scheme: light)')
      if (lightQuery.matches) {
        this.backgroundCached = 'light'
        return 'light'
      }
    }

    this.backgroundCached = 'unknown'
    return 'unknown'
  }
}
