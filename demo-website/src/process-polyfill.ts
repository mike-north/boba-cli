/**
 * Polyfill for process global in browser environment.
 * Some libraries (like marked-terminal) check process.env for terminal capabilities.
 * This must be imported before any other code that might use process.
 */

declare global {
  // eslint-disable-next-line no-var
  var process: {
    env: Record<string, string | undefined>
    platform: string
    version: string
    versions: Record<string, string>
    stdout: { isTTY?: boolean }
    stderr: { isTTY?: boolean }
  }
}

if (typeof globalThis.process === 'undefined') {
  // Create base process object
  const baseProcess = {
    platform: 'browser',
    version: '',
    versions: {},
    stdout: { isTTY: true },
    stderr: { isTTY: true },
    env: new Proxy(
      {},
      {
        get() {
          // Return empty string for any env var access
          return ''
        },
      },
    ),
  }

  // Wrap entire process object in Proxy to handle any missing properties
  globalThis.process = new Proxy(baseProcess, {
    get(target, prop) {
      if (prop in target) {
        return target[prop as keyof typeof target]
      }
      // Return empty string for any unknown property to prevent undefined errors
      return ''
    },
  }) as typeof baseProcess
}

export {}
