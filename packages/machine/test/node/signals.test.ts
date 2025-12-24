import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import process from 'node:process'
import { NodeSignalAdapter } from '../../src/node/signals.js'

describe('NodeSignalAdapter', () => {
  let adapter: NodeSignalAdapter
  let originalOn: typeof process.on
  let originalOff: typeof process.off
  let signalHandlers: Map<string, Set<(...args: unknown[]) => void>>

  beforeEach(() => {
    adapter = new NodeSignalAdapter()
    signalHandlers = new Map()

    // Mock process.on and process.off
    originalOn = process.on
    originalOff = process.off

    process.on = vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      if (!signalHandlers.has(event)) {
        signalHandlers.set(event, new Set())
      }
      signalHandlers.get(event)!.add(handler)
      return process as NodeJS.Process
    }) as typeof process.on

    process.off = vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      const handlers = signalHandlers.get(event)
      if (handlers) {
        handlers.delete(handler)
      }
      return process as NodeJS.Process
    }) as typeof process.off
  })

  afterEach(() => {
    adapter.dispose()
    process.on = originalOn
    process.off = originalOff
  })

  describe('onInterrupt', () => {
    it('registers handler for SIGINT', () => {
      const handler = vi.fn()
      adapter.onInterrupt(handler)
      expect(process.on).toHaveBeenCalledWith('SIGINT', expect.any(Function))
    })

    it('only registers SIGINT listener once', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInterrupt(handler1)
      adapter.onInterrupt(handler2)

      expect(process.on).toHaveBeenCalledTimes(1)
    })

    it('calls handler when SIGINT is emitted', () => {
      const handler = vi.fn()
      const disposable = adapter.onInterrupt(handler)

      const handlers = signalHandlers.get('SIGINT')
      expect(handlers?.size).toBe(1)

      // Simulate SIGINT
      const handlerFunc = Array.from(handlers!)[0]
      handlerFunc()

      expect(handler).toHaveBeenCalledTimes(1)

      disposable.dispose()
    })

    it('calls all handlers when SIGINT is emitted', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInterrupt(handler1)
      adapter.onInterrupt(handler2)

      const handlers = signalHandlers.get('SIGINT')
      const handlerFunc = Array.from(handlers!)[0]
      handlerFunc()

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('unregisters SIGINT when last handler is disposed', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const disposable1 = adapter.onInterrupt(handler1)
      const disposable2 = adapter.onInterrupt(handler2)

      expect(signalHandlers.get('SIGINT')?.size).toBe(1)

      disposable1.dispose()
      expect(process.off).not.toHaveBeenCalled()

      disposable2.dispose()
      expect(process.off).toHaveBeenCalledWith('SIGINT', expect.any(Function))
    })

    it('returns disposable that removes handler', () => {
      const handler = vi.fn()
      const disposable = adapter.onInterrupt(handler)

      expect(signalHandlers.get('SIGINT')?.size).toBe(1)

      disposable.dispose()

      // Handler should be removed from internal set
      // Register another handler to verify the listener gets cleaned up when last handler removed
      const handler2 = vi.fn()
      const disposable2 = adapter.onInterrupt(handler2)
      disposable2.dispose()
      expect(process.off).toHaveBeenCalledWith('SIGINT', expect.any(Function))
    })
  })

  describe('onTerminate', () => {
    it('registers handler for SIGTERM', () => {
      const handler = vi.fn()
      adapter.onTerminate(handler)
      expect(process.on).toHaveBeenCalledWith('SIGTERM', expect.any(Function))
    })

    it('only registers SIGTERM listener once', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onTerminate(handler1)
      adapter.onTerminate(handler2)

      expect(process.on).toHaveBeenCalledTimes(1)
    })

    it('calls handler when SIGTERM is emitted', () => {
      const handler = vi.fn()
      adapter.onTerminate(handler)

      const handlers = signalHandlers.get('SIGTERM')
      const handlerFunc = Array.from(handlers!)[0]
      handlerFunc()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('unregisters SIGTERM when last handler is disposed', () => {
      const handler = vi.fn()
      const disposable = adapter.onTerminate(handler)

      disposable.dispose()

      expect(process.off).toHaveBeenCalledWith('SIGTERM', expect.any(Function))
    })
  })

  describe('dispose', () => {
    it('unregisters all signal handlers', () => {
      adapter.onInterrupt(vi.fn())
      adapter.onTerminate(vi.fn())

      adapter.dispose()

      expect(process.off).toHaveBeenCalledWith('SIGINT', expect.any(Function))
      expect(process.off).toHaveBeenCalledWith('SIGTERM', expect.any(Function))
    })

    it('clears all handlers', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInterrupt(handler1)
      adapter.onTerminate(handler2)

      adapter.dispose()

      // Try to call handlers - they should not be in the internal sets
      expect(signalHandlers.get('SIGINT')?.size).toBe(0)
      expect(signalHandlers.get('SIGTERM')?.size).toBe(0)
    })

    it('can be called multiple times safely', () => {
      adapter.onInterrupt(vi.fn())
      adapter.dispose()
      adapter.dispose() // Should not throw

      expect(process.off).toHaveBeenCalledTimes(2) // Once per dispose
    })

    it('prevents handlers from being called after dispose', () => {
      const handler = vi.fn()
      adapter.onInterrupt(handler)

      const handlers = signalHandlers.get('SIGINT')
      const handlerFunc = Array.from(handlers!)[0]

      adapter.dispose()

      // Handler should still be called if signal was registered, but internal sets are cleared
      handlerFunc()
      // The handler won't be called because we cleared the internal sets
      // But the process listener is still registered in our mock
      expect(handler).not.toHaveBeenCalled()
    })
  })
})

