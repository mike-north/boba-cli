import { describe, expect, it, vi } from 'vitest'
import {
  NodePlatformAdapter,
  createNodePlatform,
  NodeClipboardAdapter,
  NodeEnvironmentAdapter,
  NodeSignalAdapter,
  NodeTerminalAdapter,
} from '../../src/node/index.js'
import type { PlatformAdapter } from '../../src/types.js'

describe('NodePlatformAdapter', () => {
  describe('constructor', () => {
    it('creates platform adapter with default options', () => {
      const adapter = new NodePlatformAdapter()
      expect(adapter).toBeInstanceOf(NodePlatformAdapter)
      expect(adapter.terminal).toBeInstanceOf(NodeTerminalAdapter)
      expect(adapter.signals).toBeInstanceOf(NodeSignalAdapter)
      expect(adapter.clipboard).toBeInstanceOf(NodeClipboardAdapter)
      expect(adapter.environment).toBeInstanceOf(NodeEnvironmentAdapter)
    })

    it('creates platform adapter with custom streams', () => {
      const mockInput = {
        on: vi.fn(),
        off: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
      } as unknown as NodeJS.ReadableStream

      const mockOutput = {
        on: vi.fn(),
        off: vi.fn(),
        write: vi.fn(),
        columns: 100,
        rows: 50,
      } as unknown as NodeJS.WriteStream

      const adapter = new NodePlatformAdapter({
        input: mockInput,
        output: mockOutput,
      })

      expect(adapter.terminal).toBeInstanceOf(NodeTerminalAdapter)
    })
  })

  describe('dispose', () => {
    it('disposes all adapters', () => {
      const adapter = new NodePlatformAdapter()
      const terminalDispose = vi.spyOn(adapter.terminal, 'dispose')
      const signalsDispose = vi.spyOn(adapter.signals, 'dispose')

      adapter.dispose()

      expect(terminalDispose).toHaveBeenCalledTimes(1)
      expect(signalsDispose).toHaveBeenCalledTimes(1)
    })

    it('can be called multiple times safely', () => {
      const adapter = new NodePlatformAdapter()
      adapter.dispose()
      adapter.dispose() // Should not throw
    })
  })

  describe('platform adapter interface', () => {
    it('implements PlatformAdapter interface', () => {
      const adapter = new NodePlatformAdapter()
      const platformAdapter: PlatformAdapter = adapter

      expect(platformAdapter.terminal).toBeDefined()
      expect(platformAdapter.signals).toBeDefined()
      expect(platformAdapter.clipboard).toBeDefined()
      expect(platformAdapter.environment).toBeDefined()
      expect(typeof platformAdapter.dispose).toBe('function')
    })
  })
})

describe('createNodePlatform', () => {
  it('creates platform adapter', () => {
    const platform = createNodePlatform()
    expect(platform).toBeInstanceOf(NodePlatformAdapter)
  })

  it('creates platform adapter with options', () => {
    const mockInput = {
      on: vi.fn(),
      off: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    } as unknown as NodeJS.ReadableStream

    const platform = createNodePlatform({ input: mockInput })
    expect(platform).toBeInstanceOf(NodePlatformAdapter)
  })

  it('returns PlatformAdapter interface', () => {
    const platform = createNodePlatform()
    const platformAdapter: PlatformAdapter = platform

    expect(platformAdapter.terminal).toBeDefined()
    expect(platformAdapter.signals).toBeDefined()
    expect(platformAdapter.clipboard).toBeDefined()
    expect(platformAdapter.environment).toBeDefined()
  })
})
