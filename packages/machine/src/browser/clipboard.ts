import type { ClipboardAdapter } from '../types.js'

/**
 * Browser clipboard adapter using the Clipboard API.
 * Falls back gracefully when the API is not available.
 * @public
 */
export class BrowserClipboardAdapter implements ClipboardAdapter {
  async read(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Clipboard API not available')
    }

    try {
      return await navigator.clipboard.readText()
    } catch (error) {
      // The Clipboard API may throw if permission is denied
      throw new Error(
        `Failed to read from clipboard: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  async write(text: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Clipboard API not available')
    }

    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      // The Clipboard API may throw if permission is denied
      throw new Error(
        `Failed to write to clipboard: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  isAvailable(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      typeof navigator.clipboard !== 'undefined' &&
      typeof navigator.clipboard.readText === 'function' &&
      typeof navigator.clipboard.writeText === 'function'
    )
  }
}
