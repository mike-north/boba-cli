import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { BrowserClipboardAdapter } from '../../src/browser/clipboard.js'

describe('BrowserClipboardAdapter', () => {
  let originalNavigator: Navigator
  let mockClipboard: {
    readText: ReturnType<typeof vi.fn>
    writeText: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    originalNavigator = global.navigator

    mockClipboard = {
      readText: vi.fn(),
      writeText: vi.fn(),
    }

    // Mock navigator.clipboard
    Object.defineProperty(global, 'navigator', {
      value: {
        clipboard: mockClipboard,
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })
  })

  describe('isAvailable', () => {
    it('returns true when Clipboard API is available', () => {
      const adapter = new BrowserClipboardAdapter()
      expect(adapter.isAvailable()).toBe(true)
    })

    it('returns false when navigator is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
        configurable: true,
      })
      const adapter = new BrowserClipboardAdapter()
      expect(adapter.isAvailable()).toBe(false)
    })

    it('returns false when clipboard is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      })
      const adapter = new BrowserClipboardAdapter()
      expect(adapter.isAvailable()).toBe(false)
    })

    it('returns false when readText is not a function', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          clipboard: {
            readText: 'not a function',
            writeText: vi.fn(),
          },
        },
        writable: true,
        configurable: true,
      })
      const adapter = new BrowserClipboardAdapter()
      expect(adapter.isAvailable()).toBe(false)
    })

    it('returns false when writeText is not a function', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          clipboard: {
            readText: vi.fn(),
            writeText: 'not a function',
          },
        },
        writable: true,
        configurable: true,
      })
      const adapter = new BrowserClipboardAdapter()
      expect(adapter.isAvailable()).toBe(false)
    })
  })

  describe('read', () => {
    it('reads from clipboard when available', async () => {
      mockClipboard.readText.mockResolvedValue('clipboard content')
      const adapter = new BrowserClipboardAdapter()

      const result = await adapter.read()

      expect(result).toBe('clipboard content')
      expect(mockClipboard.readText).toHaveBeenCalledTimes(1)
    })

    it('throws error when clipboard is not available', async () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      })
      const adapter = new BrowserClipboardAdapter()

      await expect(adapter.read()).rejects.toThrow('Clipboard API not available')
    })

    it('wraps clipboard API errors', async () => {
      const error = new Error('Permission denied')
      mockClipboard.readText.mockRejectedValue(error)
      const adapter = new BrowserClipboardAdapter()

      await expect(adapter.read()).rejects.toThrow('Failed to read from clipboard')
      await expect(adapter.read()).rejects.toThrow('Permission denied')
    })
  })

  describe('write', () => {
    it('writes to clipboard when available', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined)
      const adapter = new BrowserClipboardAdapter()

      await adapter.write('hello world')

      expect(mockClipboard.writeText).toHaveBeenCalledWith('hello world')
      expect(mockClipboard.writeText).toHaveBeenCalledTimes(1)
    })

    it('throws error when clipboard is not available', async () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      })
      const adapter = new BrowserClipboardAdapter()

      await expect(adapter.write('test')).rejects.toThrow('Clipboard API not available')
    })

    it('wraps clipboard API errors', async () => {
      const error = new Error('Permission denied')
      mockClipboard.writeText.mockRejectedValue(error)
      const adapter = new BrowserClipboardAdapter()

      await expect(adapter.write('test')).rejects.toThrow('Failed to write to clipboard')
      await expect(adapter.write('test')).rejects.toThrow('Permission denied')
    })
  })
})

