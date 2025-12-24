/**
 * Browser platform adapters for \@suds-cli/machine.
 * @packageDocumentation
 */

import type {
  ClipboardAdapter,
  Disposable,
  EnvironmentAdapter,
  PlatformAdapter,
  SignalAdapter,
  TerminalAdapter,
} from '../types.js'
import { BrowserClipboardAdapter } from './clipboard.js'
import { BrowserEnvironmentAdapter } from './environment.js'
import { BrowserSignalAdapter } from './signals.js'
import { XtermTerminalAdapter, type XtermTerminal } from './terminal.js'

export { BrowserClipboardAdapter } from './clipboard.js'
export { BrowserEnvironmentAdapter } from './environment.js'
export { BrowserSignalAdapter } from './signals.js'
export { XtermTerminalAdapter, type XtermTerminal } from './terminal.js'

/**
 * Options for creating a browser platform adapter.
 * @public
 */
export interface BrowserPlatformOptions {
  /** xterm.js Terminal instance (required). */
  terminal: XtermTerminal
  /** Environment variable overrides. */
  env?: Record<string, string>
}

/**
 * Complete browser platform adapter.
 * Combines xterm.js terminal, browser signals, clipboard, and environment adapters.
 * @public
 */
export class BrowserPlatformAdapter implements PlatformAdapter {
  readonly terminal: TerminalAdapter
  readonly signals: SignalAdapter
  readonly clipboard: ClipboardAdapter
  readonly environment: EnvironmentAdapter

  private disposed = false
  private readonly disposables: Disposable[] = []

  /**
   * Create a new browser platform adapter.
   * @param options - Configuration options (requires xterm.js Terminal)
   */
  constructor(options: BrowserPlatformOptions) {
    const terminalAdapter = new XtermTerminalAdapter(options.terminal)
    const signalAdapter = new BrowserSignalAdapter()
    const clipboardAdapter = new BrowserClipboardAdapter()
    const environmentAdapter = new BrowserEnvironmentAdapter(options.env)

    this.terminal = terminalAdapter
    this.signals = signalAdapter
    this.clipboard = clipboardAdapter
    this.environment = environmentAdapter

    this.disposables.push(terminalAdapter, signalAdapter)
  }

  dispose(): void {
    if (this.disposed) {
      return
    }
    this.disposed = true

    for (const disposable of this.disposables) {
      disposable.dispose()
    }
  }
}

/**
 * Create a browser platform adapter with xterm.js.
 * @param options - Configuration options
 * @returns A new platform adapter
 * @public
 */
export function createBrowserPlatform(
  options: BrowserPlatformOptions,
): PlatformAdapter {
  return new BrowserPlatformAdapter(options)
}
