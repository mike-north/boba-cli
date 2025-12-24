import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  BrowserPlatformAdapter,
  createBrowserPlatform,
  BrowserClipboardAdapter,
  BrowserEnvironmentAdapter,
  BrowserSignalAdapter,
  XtermTerminalAdapter,
} from '../../src/browser/index.js'
import type { PlatformAdapter } from '../../src/types.js'
import type { XtermTerminal } from '../../src/browser/terminal.js'

describe('BrowserPlatformAdapter', () => {
  let mockTerminal: XtermTerminal

  beforeEach(() => {
    mockTerminal = {
      cols: 80,
      rows: 24,
      write: vi.fn(),
      onData: vi.fn(() => ({ dispose: vi.fn() })),
      onResize: vi.fn(() => ({ dispose: vi.fn() })),
    } as unknown as XtermTerminal
  })

  describe('constructor', () => {
    it('creates platform adapter with xterm.js terminal', () => {
      const adapter = new BrowserPlatformAdapter({ terminal: mockTerminal })
      expect(adapter).toBeInstanceOf(BrowserPlatformAdapter)
      expect(adapter.terminal).toBeInstanceOf(XtermTerminalAdapter)
      expect(adapter.signals).toBeInstanceOf(BrowserSignalAdapter)
      expect(adapter.clipboard).toBeInstanceOf(BrowserClipboardAdapter)
      expect(adapter.environment).toBeInstanceOf(BrowserEnvironmentAdapter)
    })

    it('creates platform adapter with environment overrides', () => {
      const adapter = new BrowserPlatformAdapter({
        terminal: mockTerminal,
        env: { TEST_VAR: 'test-value' },
      })

      expect(adapter.environment.get('TEST_VAR')).toBe('test-value')
    })
  })

  describe('dispose', () => {
    it('disposes all adapters', () => {
      const adapter = new BrowserPlatformAdapter({ terminal: mockTerminal })
      const terminalDispose = vi.spyOn(adapter.terminal, 'dispose')
      const signalsDispose = vi.spyOn(adapter.signals, 'dispose')

      adapter.dispose()

      expect(terminalDispose).toHaveBeenCalledTimes(1)
      expect(signalsDispose).toHaveBeenCalledTimes(1)
    })

    it('can be called multiple times safely', () => {
      const adapter = new BrowserPlatformAdapter({ terminal: mockTerminal })
      adapter.dispose()
      adapter.dispose() // Should not throw
    })
  })

  describe('platform adapter interface', () => {
    it('implements PlatformAdapter interface', () => {
      const adapter = new BrowserPlatformAdapter({ terminal: mockTerminal })
      const platformAdapter: PlatformAdapter = adapter

      expect(platformAdapter.terminal).toBeDefined()
      expect(platformAdapter.signals).toBeDefined()
      expect(platformAdapter.clipboard).toBeDefined()
      expect(platformAdapter.environment).toBeDefined()
      expect(typeof platformAdapter.dispose).toBe('function')
    })
  })
})

describe('createBrowserPlatform', () => {
  let mockTerminal: XtermTerminal

  beforeEach(() => {
    mockTerminal = {
      cols: 80,
      rows: 24,
      write: vi.fn(),
      onData: vi.fn(() => ({ dispose: vi.fn() })),
      onResize: vi.fn(() => ({ dispose: vi.fn() })),
    } as unknown as XtermTerminal
  })

  it('creates platform adapter', () => {
    const platform = createBrowserPlatform({ terminal: mockTerminal })
    expect(platform).toBeInstanceOf(BrowserPlatformAdapter)
  })

  it('creates platform adapter with options', () => {
    const platform = createBrowserPlatform({
      terminal: mockTerminal,
      env: { TEST_VAR: 'value' },
    })
    expect(platform).toBeInstanceOf(BrowserPlatformAdapter)
    expect(platform.environment.get('TEST_VAR')).toBe('value')
  })

  it('returns PlatformAdapter interface', () => {
    const platform = createBrowserPlatform({ terminal: mockTerminal })
    const platformAdapter: PlatformAdapter = platform

    expect(platformAdapter.terminal).toBeDefined()
    expect(platformAdapter.signals).toBeDefined()
    expect(platformAdapter.clipboard).toBeDefined()
    expect(platformAdapter.environment).toBeDefined()
  })
})

