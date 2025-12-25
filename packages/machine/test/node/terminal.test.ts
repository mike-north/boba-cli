import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { NodeTerminalAdapter } from '../../src/node/terminal.js'
import { encodeString } from '../../src/bytes.js'

describe('NodeTerminalAdapter', () => {
  let mockInput: NodeJS.ReadableStream
  let mockOutput: NodeJS.WritableStream
  let dataHandlers: Set<(data: Buffer | string) => void>
  let resizeHandlers: Set<() => void>

  beforeEach(() => {
    dataHandlers = new Set()
    resizeHandlers = new Set()

    mockInput = {
      on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        if (event === 'data') {
          dataHandlers.add(handler as (data: Buffer | string) => void)
        }
        return mockInput
      }) as NodeJS.ReadableStream['on'],
      off: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        if (event === 'data') {
          dataHandlers.delete(handler as (data: Buffer | string) => void)
        }
        return mockInput
      }) as NodeJS.ReadableStream['off'],
      pause: vi.fn(),
      resume: vi.fn(),
    } as unknown as NodeJS.ReadableStream

    mockOutput = {
      on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        if (event === 'resize') {
          resizeHandlers.add(handler as () => void)
        }
        return mockOutput
      }) as NodeJS.WritableStream['on'],
      off: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
        if (event === 'resize') {
          resizeHandlers.delete(handler as () => void)
        }
        return mockOutput
      }) as NodeJS.WritableStream['off'],
      write: vi.fn(),
      columns: 80,
      rows: 24,
    } as unknown as NodeJS.WriteStream
  })

  describe('constructor', () => {
    it('creates adapter with default streams', () => {
      const adapter = new NodeTerminalAdapter()
      expect(adapter).toBeInstanceOf(NodeTerminalAdapter)
    })

    it('creates adapter with custom streams', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      expect(adapter).toBeInstanceOf(NodeTerminalAdapter)
    })
  })

  describe('onInput', () => {
    it('registers input handler', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler = vi.fn()

      adapter.onInput(handler)

      expect(mockInput.on).toHaveBeenCalledWith('data', expect.any(Function))
      expect(mockInput.resume).toHaveBeenCalled()
    })

    it('only registers data listener once', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInput(handler1)
      adapter.onInput(handler2)

      expect(mockInput.on).toHaveBeenCalledTimes(1)
    })

    it('calls handler with Buffer data', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler = vi.fn()
      adapter.onInput(handler)

      const dataHandler = Array.from(dataHandlers)[0]
      const buffer = Buffer.from('hello')
      dataHandler(buffer)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(expect.any(Uint8Array))
      expect(Array.from(handler.mock.calls[0][0])).toEqual(Array.from(buffer))
    })

    it('calls handler with string data', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler = vi.fn()
      adapter.onInput(handler)

      const dataHandler = Array.from(dataHandlers)[0]
      dataHandler('hello')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(encodeString('hello'))
    })

    it('calls all handlers', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInput(handler1)
      adapter.onInput(handler2)

      const dataHandler = Array.from(dataHandlers)[0]
      dataHandler('test')

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('unregisters data listener when last handler is disposed', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const disposable1 = adapter.onInput(handler1)
      const disposable2 = adapter.onInput(handler2)

      disposable1.dispose()
      expect(mockInput.off).not.toHaveBeenCalled()

      disposable2.dispose()
      expect(mockInput.off).toHaveBeenCalledWith('data', expect.any(Function))
    })

    it('returns disposable', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler = vi.fn()
      const disposable = adapter.onInput(handler)

      expect(disposable).toHaveProperty('dispose')
      expect(typeof disposable.dispose).toBe('function')
    })
  })

  describe('onResize', () => {
    it('registers resize handler', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler = vi.fn()

      adapter.onResize(handler)

      expect(mockOutput.on).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('does not register resize listener for non-writable streams', () => {
      const nonWritableOutput = {
        write: vi.fn(),
      } as unknown as NodeJS.WritableStream

      const adapter = new NodeTerminalAdapter(mockInput, nonWritableOutput)
      const handler = vi.fn()

      adapter.onResize(handler)

      expect(mockOutput.on).not.toHaveBeenCalled()
    })

    it('calls handler with terminal size', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler = vi.fn()
      adapter.onResize(handler)

      const resizeHandler = Array.from(resizeHandlers)[0]
      resizeHandler()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith({
        columns: 80,
        rows: 24,
      })
    })

    it('unregisters resize listener when last handler is disposed', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler = vi.fn()
      const disposable = adapter.onResize(handler)

      disposable.dispose()

      expect(mockOutput.off).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      )
    })
  })

  describe('write', () => {
    it('writes to output stream', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)

      adapter.write('hello world')

      expect(mockOutput.write).toHaveBeenCalledWith('hello world')
    })

    it('does not write empty strings', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)

      adapter.write('')

      expect(mockOutput.write).not.toHaveBeenCalled()
    })
  })

  describe('getSize', () => {
    it('returns size from output stream', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)

      const size = adapter.getSize()

      expect(size).toEqual({ columns: 80, rows: 24 })
    })

    it('returns default size when columns missing', () => {
      const outputWithoutColumns = {
        ...mockOutput,
        columns: undefined,
      } as unknown as NodeJS.WriteStream

      const adapter = new NodeTerminalAdapter(mockInput, outputWithoutColumns)

      const size = adapter.getSize()

      expect(size.columns).toBe(80)
      expect(size.rows).toBe(24)
    })

    it('returns default size when rows missing', () => {
      const outputWithoutRows = {
        ...mockOutput,
        rows: undefined,
      } as unknown as NodeJS.WriteStream

      const adapter = new NodeTerminalAdapter(mockInput, outputWithoutRows)

      const size = adapter.getSize()

      expect(size.columns).toBe(80)
      expect(size.rows).toBe(24)
    })

    it('returns default size when both missing', () => {
      const outputWithoutSize = {
        write: vi.fn(),
      } as unknown as NodeJS.WriteStream

      const adapter = new NodeTerminalAdapter(mockInput, outputWithoutSize)

      const size = adapter.getSize()

      expect(size).toEqual({ columns: 80, rows: 24 })
    })
  })

  describe('enableRawMode', () => {
    it('enables raw mode on TTY input', () => {
      const ttyInput = {
        ...mockInput,
        isTTY: true,
        setRawMode: vi.fn(),
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(ttyInput, mockOutput)

      adapter.enableRawMode()

      expect(ttyInput.setRawMode).toHaveBeenCalledWith(true)
      expect(ttyInput.resume).toHaveBeenCalled()
    })

    it('does not enable raw mode on non-TTY', () => {
      const nonTtyInput = {
        ...mockInput,
        isTTY: false,
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(nonTtyInput, mockOutput)

      adapter.enableRawMode()

      expect(nonTtyInput.setRawMode).toBeUndefined()
    })

    it('does not enable raw mode when setRawMode missing', () => {
      const inputWithoutRawMode = {
        ...mockInput,
        isTTY: true,
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(inputWithoutRawMode, mockOutput)

      expect(() => adapter.enableRawMode()).not.toThrow()
    })
  })

  describe('disableRawMode', () => {
    it('disables raw mode when enabled', () => {
      const ttyInput = {
        ...mockInput,
        isTTY: true,
        setRawMode: vi.fn(),
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(ttyInput, mockOutput)

      adapter.enableRawMode()
      adapter.disableRawMode()

      expect(ttyInput.setRawMode).toHaveBeenCalledWith(false)
      expect(ttyInput.pause).toHaveBeenCalled()
    })

    it('does not disable raw mode when not enabled', () => {
      const ttyInput = {
        ...mockInput,
        isTTY: true,
        setRawMode: vi.fn(),
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(ttyInput, mockOutput)

      adapter.disableRawMode()

      expect(ttyInput.setRawMode).not.toHaveBeenCalled()
    })
  })

  describe('isTTY', () => {
    it('returns true for TTY input', () => {
      const ttyInput = {
        ...mockInput,
        isTTY: true,
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(ttyInput, mockOutput)

      expect(adapter.isTTY()).toBe(true)
    })

    it('returns false for non-TTY input', () => {
      const nonTtyInput = {
        ...mockInput,
        isTTY: false,
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(nonTtyInput, mockOutput)

      expect(adapter.isTTY()).toBe(false)
    })

    it('returns false when isTTY is not boolean', () => {
      const inputWithoutIsTTY = {
        ...mockInput,
        isTTY: undefined,
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(inputWithoutIsTTY, mockOutput)

      expect(adapter.isTTY()).toBe(false)
    })
  })

  describe('dispose', () => {
    it('unregisters all listeners', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      adapter.onInput(vi.fn())
      adapter.onResize(vi.fn())

      adapter.dispose()

      expect(mockInput.off).toHaveBeenCalledWith('data', expect.any(Function))
      expect(mockOutput.off).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      )
    })

    it('disables raw mode', () => {
      const ttyInput = {
        ...mockInput,
        isTTY: true,
        setRawMode: vi.fn(),
      } as unknown as NodeJS.ReadStream

      const adapter = new NodeTerminalAdapter(ttyInput, mockOutput)
      adapter.enableRawMode()

      adapter.dispose()

      expect(ttyInput.setRawMode).toHaveBeenCalledWith(false)
    })

    it('clears all handlers', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInput(handler1)
      adapter.onResize(handler2)

      adapter.dispose()

      // Handlers should be cleared - can't directly test but handlers won't be called
      expect(dataHandlers.size).toBe(0)
      expect(resizeHandlers.size).toBe(0)
    })

    it('can be called multiple times safely', () => {
      const adapter = new NodeTerminalAdapter(mockInput, mockOutput)
      adapter.onInput(vi.fn()) // Need at least one handler to register listener
      adapter.dispose()

      // Clear mock call history
      vi.clearAllMocks()

      adapter.dispose() // Should not throw and should not call off again since already disposed

      // After first dispose, second dispose should not call off again
      expect(mockInput.off).not.toHaveBeenCalled()
    })
  })
})
