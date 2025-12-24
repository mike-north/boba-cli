import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { BrowserEnvironmentAdapter } from '../../src/browser/environment.js'

describe('BrowserEnvironmentAdapter', () => {
  let originalWindow: Window & typeof globalThis
  let mockMatchMedia: ReturnType<typeof vi.fn>

  beforeEach(() => {
    originalWindow = global.window
    mockMatchMedia = vi.fn()
  })

  afterEach(() => {
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    })
  })

  describe('get', () => {
    it('returns undefined when variable not in overrides', () => {
      const adapter = new BrowserEnvironmentAdapter()
      expect(adapter.get('NON_EXISTENT')).toBeUndefined()
    })

    it('returns override value', () => {
      const adapter = new BrowserEnvironmentAdapter({ TEST_VAR: 'test-value' })
      expect(adapter.get('TEST_VAR')).toBe('test-value')
    })

    it('returns override value when set via set method', () => {
      const adapter = new BrowserEnvironmentAdapter()
      adapter.set('TEST_VAR', 'test-value')
      expect(adapter.get('TEST_VAR')).toBe('test-value')
    })
  })

  describe('set', () => {
    it('sets environment variable override', () => {
      const adapter = new BrowserEnvironmentAdapter()
      adapter.set('TEST_VAR', 'test-value')
      expect(adapter.get('TEST_VAR')).toBe('test-value')
    })

    it('clears color support cache when env var changes', () => {
      const adapter = new BrowserEnvironmentAdapter()
      const first = adapter.getColorSupport()
      adapter.set('SOME_VAR', 'value')
      const second = adapter.getColorSupport()
      // Should get new instance (cached values cleared)
      expect(first).not.toBe(second)
    })

    it('clears background cache when env var changes', () => {
      const adapter = new BrowserEnvironmentAdapter()
      // Set initial background via override
      adapter.set('TERM_BACKGROUND', 'dark')
      const first = adapter.getTerminalBackground()
      expect(first).toBe('dark')
      
      // Change a different env var - should clear cache
      adapter.set('SOME_VAR', 'value')
      
      // Change TERM_BACKGROUND - should return new value
      adapter.set('TERM_BACKGROUND', 'light')
      const second = adapter.getTerminalBackground()
      expect(second).toBe('light')
      expect(first).not.toBe(second)
    })
  })

  describe('getColorSupport', () => {
    it('returns true color support for browsers', () => {
      const adapter = new BrowserEnvironmentAdapter()
      const support = adapter.getColorSupport()

      expect(support.level).toBe(3)
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(true)
      expect(support.has16m).toBe(true)
    })

    it('caches color support result', () => {
      const adapter = new BrowserEnvironmentAdapter()
      const first = adapter.getColorSupport()
      const second = adapter.getColorSupport()

      expect(first).toBe(second)
    })
  })

  describe('getTerminalBackground', () => {
    it('returns override when TERM_BACKGROUND is set', () => {
      const adapter = new BrowserEnvironmentAdapter({ TERM_BACKGROUND: 'dark' })
      expect(adapter.getTerminalBackground()).toBe('dark')
    })

    it('returns override for light background', () => {
      const adapter = new BrowserEnvironmentAdapter({ TERM_BACKGROUND: 'light' })
      expect(adapter.getTerminalBackground()).toBe('light')
    })

    it('detects dark from prefers-color-scheme media query', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
      })

      Object.defineProperty(global, 'window', {
        value: {
          matchMedia: mockMatchMedia,
        },
        writable: true,
        configurable: true,
      })

      const adapter = new BrowserEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('dark')
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })

    it('detects light from prefers-color-scheme media query', () => {
      // First call for dark returns false, second for light returns true
      mockMatchMedia
        .mockReturnValueOnce({ matches: false })
        .mockReturnValueOnce({ matches: true })

      Object.defineProperty(global, 'window', {
        value: {
          matchMedia: mockMatchMedia,
        },
        writable: true,
        configurable: true,
      })

      const adapter = new BrowserEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('light')
    })

    it('returns unknown when no media query matches', () => {
      mockMatchMedia.mockReturnValue({ matches: false })

      Object.defineProperty(global, 'window', {
        value: {
          matchMedia: mockMatchMedia,
        },
        writable: true,
        configurable: true,
      })

      const adapter = new BrowserEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('unknown')
    })

    it('returns unknown when matchMedia is not available', () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      })

      const adapter = new BrowserEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('unknown')
    })

    it('returns unknown when window is undefined', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      const adapter = new BrowserEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('unknown')
    })

    it('caches background result', () => {
      const adapter = new BrowserEnvironmentAdapter()
      const first = adapter.getTerminalBackground()
      const second = adapter.getTerminalBackground()

      expect(first).toBe(second)
    })
  })
})

