/**
 * Node.js platform adapters for \@suds-cli/machine.
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
import { NodeClipboardAdapter } from './clipboard.js'
import { NodeEnvironmentAdapter } from './environment.js'
import { NodeSignalAdapter } from './signals.js'
import { NodeTerminalAdapter } from './terminal.js'

export { NodeClipboardAdapter } from './clipboard.js'
export { NodeEnvironmentAdapter } from './environment.js'
export { NodeSignalAdapter } from './signals.js'
export { NodeTerminalAdapter } from './terminal.js'

/**
 * Options for creating a Node.js platform adapter.
 * @public
 */
export interface NodePlatformOptions {
  /** Custom input stream (default: process.stdin). */
  input?: NodeJS.ReadableStream
  /** Custom output stream (default: process.stdout). */
  output?: NodeJS.WritableStream
}

/**
 * Complete Node.js platform adapter.
 * Combines terminal, signal, clipboard, and environment adapters.
 * @public
 */
export class NodePlatformAdapter implements PlatformAdapter {
  readonly terminal: TerminalAdapter
  readonly signals: SignalAdapter
  readonly clipboard: ClipboardAdapter
  readonly environment: EnvironmentAdapter

  private disposed = false
  private readonly disposables: Disposable[] = []

  /**
   * Create a new Node.js platform adapter.
   * @param options - Configuration options
   */
  constructor(options: NodePlatformOptions = {}) {
    const terminalAdapter = new NodeTerminalAdapter(
      options.input,
      options.output,
    )
    const signalAdapter = new NodeSignalAdapter()
    const clipboardAdapter = new NodeClipboardAdapter()
    const environmentAdapter = new NodeEnvironmentAdapter()

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
 * Create a Node.js platform adapter with default settings.
 * @param options - Configuration options
 * @returns A new platform adapter
 * @public
 */
export function createNodePlatform(
  options: NodePlatformOptions = {},
): PlatformAdapter {
  return new NodePlatformAdapter(options)
}
