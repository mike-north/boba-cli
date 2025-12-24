import { describe, expect, it, vi, beforeEach } from 'vitest'
import { XtermTerminalAdapter } from '../../src/browser/terminal.js'
import type { XtermTerminal } from '../../src/browser/terminal.js'
import { encodeString } from '../../src/bytes.js'

describe('XtermTerminalAdapter', () => {
  let mockTerminal: XtermTerminal
  let dataListeners: Set<(data: string) => void>
  let resizeListeners: Set<(size: { cols: number; rows: number }) => void>

  beforeEach(() => {
    dataListeners = new Set()
    resizeListeners = new Set()

    mockTerminal = {
      cols: 80,
      rows: 24,
      write: vi.fn(),
      onData: vi.fn((listener: (data: string) => void) => {
        dataListeners.add(listener)
        return {
          dispose: () => {
            dataListeners.delete(listener)
          },
        }
      }),
      onResize: vi.fn((listener: (size: { cols: number; rows: number }) => void) => {
        resizeListeners.add(listener)
        return {
          dispose: () => {
            resizeListeners.delete(listener)
          },
        }
      }),
    } as unknown as XtermTerminal
  })

  describe('constructor', () => {
    it('creates adapter with xterm.js terminal', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      expect(adapter).toBeInstanceOf(XtermTerminalAdapter)
    })
  })

  describe('onInput', () => {
    it('registers input handler', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler = vi.fn()

      adapter.onInput(handler)

      expect(mockTerminal.onData).toHaveBeenCalledTimes(1)
      expect(dataListeners.size).toBe(1)
    })

    it('only registers onData listener once', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInput(handler1)
      adapter.onInput(handler2)

      expect(mockTerminal.onData).toHaveBeenCalledTimes(1)
    })

    it('calls handler with encoded data', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler = vi.fn()
      adapter.onInput(handler)

      const dataListener = Array.from(dataListeners)[0]
      dataListener('hello')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(encodeString('hello'))
    })

    it('calls all handlers', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInput(handler1)
      adapter.onInput(handler2)

      const dataListener = Array.from(dataListeners)[0]
      dataListener('test')

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('unregisters data listener when last handler is disposed', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const disposable1 = adapter.onInput(handler1)
      const disposable2 = adapter.onInput(handler2)

      expect(dataListeners.size).toBe(1)

      disposable1.dispose()
      expect(dataListeners.size).toBe(1) // Still registered

      disposable2.dispose()
      expect(dataListeners.size).toBe(0) // Now unregistered
    })

    it('returns disposable', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler = vi.fn()
      const disposable = adapter.onInput(handler)

      expect(disposable).toHaveProperty('dispose')
      expect(typeof disposable.dispose).toBe('function')
    })
  })

  describe('onResize', () => {
    it('registers resize handler', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler = vi.fn()

      adapter.onResize(handler)

      expect(mockTerminal.onResize).toHaveBeenCalledTimes(1)
      expect(resizeListeners.size).toBe(1)
    })

    it('calls handler with terminal size', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler = vi.fn()
      adapter.onResize(handler)

      const resizeListener = Array.from(resizeListeners)[0]
      resizeListener({ cols: 100, rows: 50 })

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith({ columns: 100, rows: 50 })
    })

    it('unregisters resize listener when last handler is disposed', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler = vi.fn()
      const disposable = adapter.onResize(handler)

      disposable.dispose()

      expect(resizeListeners.size).toBe(0)
    })
  })

  describe('write', () => {
    it('writes to terminal', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)

      adapter.write('hello world')

      expect(mockTerminal.write).toHaveBeenCalledWith('hello world')
    })

    it('does not write empty strings', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)

      adapter.write('')

      expect(mockTerminal.write).not.toHaveBeenCalled()
    })
  })

  describe('getSize', () => {
    it('returns size from terminal', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)

      const size = adapter.getSize()

      expect(size).toEqual({ columns: 80, rows: 24 })
    })
  })

  describe('enableRawMode / disableRawMode', () => {
    it('enableRawMode does nothing (xterm.js is always in raw mode)', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)

      expect(() => adapter.enableRawMode()).not.toThrow()
    })

    it('disableRawMode does nothing (xterm.js is always in raw mode)', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)

      expect(() => adapter.disableRawMode()).not.toThrow()
    })
  })

  describe('isTTY', () => {
    it('always returns true for xterm.js', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)

      expect(adapter.isTTY()).toBe(true)
    })
  })

  describe('dispose', () => {
    it('disposes data and resize listeners', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      adapter.onInput(vi.fn())
      adapter.onResize(vi.fn())

      adapter.dispose()

      expect(dataListeners.size).toBe(0)
      expect(resizeListeners.size).toBe(0)
    })

    it('clears all handlers', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInput(handler1)
      adapter.onResize(handler2)

      adapter.dispose()

      // Handlers should be cleared
      expect(dataListeners.size).toBe(0)
      expect(resizeListeners.size).toBe(0)
    })

    it('can be called multiple times safely', () => {
      const adapter = new XtermTerminalAdapter(mockTerminal)
      adapter.dispose()
      adapter.dispose() // Should not throw
    })
  })
})

