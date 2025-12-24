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
 * Terminal dimensions.
 * @public
 */
export interface TerminalSize {
  /** Width in columns. */
  readonly columns: number
  /** Height in rows. */
  readonly rows: number
}

/**
 * Disposable resource that can be cleaned up.
 * @public
 */
export interface Disposable {
  /** Dispose of the resource. */
  dispose(): void
}

/**
 * Handler for terminal input data.
 * @public
 */
export type InputHandler = (data: Uint8Array) => void

/**
 * Handler for terminal resize events.
 * @public
 */
export type ResizeHandler = (size: TerminalSize) => void

/**
 * Handler for signals (SIGINT, SIGTERM, etc.).
 * @public
 */
export type SignalHandler = () => void

/**
 * Terminal adapter interface for platform-agnostic terminal operations.
 * @public
 */
export interface TerminalAdapter extends Disposable {
  /**
   * Subscribe to input data.
   * @param handler - Callback to receive input as Uint8Array
   * @returns Disposable to unsubscribe
   */
  onInput(handler: InputHandler): Disposable

  /**
   * Subscribe to resize events.
   * @param handler - Callback to receive new terminal size
   * @returns Disposable to unsubscribe
   */
  onResize(handler: ResizeHandler): Disposable

  /**
   * Write data to the terminal output.
   * @param data - String data to write
   */
  write(data: string): void

  /**
   * Get the current terminal size.
   * @returns Current terminal dimensions
   */
  getSize(): TerminalSize

  /**
   * Enable raw mode (no line buffering, no echo).
   */
  enableRawMode(): void

  /**
   * Disable raw mode.
   */
  disableRawMode(): void

  /**
   * Check if the terminal is a TTY.
   * @returns True if the terminal is a TTY
   */
  isTTY(): boolean
}

/**
 * Signal adapter interface for handling OS signals.
 * @public
 */
export interface SignalAdapter extends Disposable {
  /**
   * Subscribe to interrupt signals (SIGINT in Node, beforeunload in browser).
   * @param handler - Callback to invoke on interrupt
   * @returns Disposable to unsubscribe
   */
  onInterrupt(handler: SignalHandler): Disposable

  /**
   * Subscribe to termination signals (SIGTERM in Node).
   * @param handler - Callback to invoke on termination
   * @returns Disposable to unsubscribe
   */
  onTerminate(handler: SignalHandler): Disposable
}

/**
 * Clipboard adapter interface for platform-agnostic clipboard operations.
 * @public
 */
export interface ClipboardAdapter {
  /**
   * Read text from the clipboard.
   * @returns Promise resolving to clipboard text
   */
  read(): Promise<string>

  /**
   * Write text to the clipboard.
   * @param text - Text to write
   * @returns Promise resolving when complete
   */
  write(text: string): Promise<void>

  /**
   * Check if clipboard operations are available.
   * @returns True if clipboard is available
   */
  isAvailable(): boolean
}

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

/**
 * Complete platform adapter combining all platform-specific functionality.
 * @public
 */
export interface PlatformAdapter extends Disposable {
  /** Terminal I/O adapter. */
  readonly terminal: TerminalAdapter

  /** Signal handling adapter. */
  readonly signals: SignalAdapter

  /** Clipboard operations adapter. */
  readonly clipboard: ClipboardAdapter

  /** Environment access adapter. */
  readonly environment: EnvironmentAdapter
}
