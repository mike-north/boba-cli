import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { BrowserSignalAdapter } from '../../src/browser/signals.js'

describe('BrowserSignalAdapter', () => {
  let adapter: BrowserSignalAdapter
  let originalWindow: Window & typeof globalThis
  let mockWindow: {
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
  }
  let eventListeners: Map<string, Set<EventListener>>

  beforeEach(() => {
    adapter = new BrowserSignalAdapter()
    originalWindow = global.window
    eventListeners = new Map()

    mockWindow = {
      addEventListener: vi.fn((event: string, handler: EventListener) => {
        if (!eventListeners.has(event)) {
          eventListeners.set(event, new Set())
        }
        eventListeners.get(event)!.add(handler)
      }),
      removeEventListener: vi.fn((event: string, handler: EventListener) => {
        const handlers = eventListeners.get(event)
        if (handlers) {
          handlers.delete(handler)
        }
      }),
    }

    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    adapter.dispose()
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    })
  })

  describe('onInterrupt', () => {
    it('registers beforeunload handler', () => {
      const handler = vi.fn()
      adapter.onInterrupt(handler)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      )
    })

    it('only registers beforeunload listener once', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInterrupt(handler1)
      adapter.onInterrupt(handler2)

      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(1)
    })

    it('calls handler when beforeunload is emitted', () => {
      const handler = vi.fn()
      adapter.onInterrupt(handler)

      const handlers = eventListeners.get('beforeunload')
      expect(handlers?.size).toBe(1)

      const beforeUnloadEvent = {
        preventDefault: vi.fn(),
      } as unknown as BeforeUnloadEvent

      const handlerFunc = Array.from(handlers!)[0] as (
        e: BeforeUnloadEvent,
      ) => void
      handlerFunc(beforeUnloadEvent)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(beforeUnloadEvent.preventDefault).toHaveBeenCalled()
    })

    it('calls all handlers when beforeunload is emitted', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInterrupt(handler1)
      adapter.onInterrupt(handler2)

      const handlers = eventListeners.get('beforeunload')
      const handlerFunc = Array.from(handlers!)[0] as (
        e: BeforeUnloadEvent,
      ) => void
      handlerFunc({ preventDefault: vi.fn() } as unknown as BeforeUnloadEvent)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('unregisters beforeunload when last handler is disposed', () => {
      const handler = vi.fn()
      const disposable = adapter.onInterrupt(handler)

      disposable.dispose()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      )
    })

    it('does not register listener when window is undefined', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      const handler = vi.fn()
      adapter.onInterrupt(handler)

      expect(mockWindow.addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('onTerminate', () => {
    it('registers pagehide handler', () => {
      const handler = vi.fn()
      adapter.onTerminate(handler)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'pagehide',
        expect.any(Function),
      )
    })

    it('only registers pagehide listener once', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onTerminate(handler1)
      adapter.onTerminate(handler2)

      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(1)
    })

    it('calls handler when pagehide is emitted', () => {
      const handler = vi.fn()
      adapter.onTerminate(handler)

      const handlers = eventListeners.get('pagehide')
      const handlerFunc = Array.from(handlers!)[0] as () => void
      handlerFunc()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('unregisters pagehide when last handler is disposed', () => {
      const handler = vi.fn()
      const disposable = adapter.onTerminate(handler)

      disposable.dispose()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'pagehide',
        expect.any(Function),
      )
    })
  })

  describe('dispose', () => {
    it('unregisters all event listeners', () => {
      adapter.onInterrupt(vi.fn())
      adapter.onTerminate(vi.fn())

      adapter.dispose()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      )
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'pagehide',
        expect.any(Function),
      )
    })

    it('clears all handlers', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      adapter.onInterrupt(handler1)
      adapter.onTerminate(handler2)

      adapter.dispose()

      expect(eventListeners.get('beforeunload')?.size).toBe(0)
      expect(eventListeners.get('pagehide')?.size).toBe(0)
    })

    it('can be called multiple times safely', () => {
      adapter.onInterrupt(vi.fn())
      adapter.dispose()
      adapter.dispose() // Should not throw
    })
  })
})
