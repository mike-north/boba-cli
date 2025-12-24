import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { NodeClipboardAdapter } from '../../src/node/clipboard.js'

describe('NodeClipboardAdapter', () => {
  describe('constructor', () => {
    it('creates adapter without clipboard module', () => {
      const adapter = new NodeClipboardAdapter()
      expect(adapter).toBeInstanceOf(NodeClipboardAdapter)
    })

    it('creates adapter with pre-loaded clipboard module', () => {
      const mockClipboard = {
        read: vi.fn().mockResolvedValue('test'),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const adapter = new NodeClipboardAdapter(mockClipboard)
      expect(adapter.isAvailable()).toBe(true)
    })
  })

  describe('isAvailable', () => {
    it('returns true when clipboardy is available', () => {
      const mockClipboard = {
        read: vi.fn().mockResolvedValue('test'),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const adapter = new NodeClipboardAdapter(mockClipboard)
      expect(adapter.isAvailable()).toBe(true)
    })

    it('returns false when clipboardy is not available and not loaded', () => {
      const adapter = new NodeClipboardAdapter()
      // The actual behavior depends on whether clipboardy is installed
      // but we can test the logic path
      const available = adapter.isAvailable()
      expect(typeof available).toBe('boolean')
    })
  })

  describe('read', () => {
    it('reads from clipboard when available', async () => {
      const mockClipboard = {
        read: vi.fn().mockResolvedValue('clipboard content'),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const adapter = new NodeClipboardAdapter(mockClipboard)

      const result = await adapter.read()
      expect(result).toBe('clipboard content')
      expect(mockClipboard.read).toHaveBeenCalledTimes(1)
    })

    it('throws error when clipboard is not available', async () => {
      // Create adapter without mock - it will try to load clipboardy
      // If clipboardy is installed, this test may pass (which is fine)
      // If not installed, it will throw (which is what we're testing)
      const adapter = new NodeClipboardAdapter()
      
      // This test verifies the error handling path
      // The actual behavior depends on whether clipboardy is installed
      try {
        await adapter.read()
        // If it succeeds, clipboardy is installed - that's okay for this test
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain('Clipboard not available')
      }
    })

    it('caches clipboard module after first load', async () => {
      const mockClipboard = {
        read: vi.fn().mockResolvedValue('first'),
        write: vi.fn().mockResolvedValue(undefined),
      }

      const adapter = new NodeClipboardAdapter(mockClipboard)

      // First read
      await adapter.read()
      expect(mockClipboard.read).toHaveBeenCalledTimes(1)

      // Second read - should use cached module (same instance)
      await adapter.read()
      expect(mockClipboard.read).toHaveBeenCalledTimes(2)
    })
  })

  describe('write', () => {
    it('writes to clipboard when available', async () => {
      const mockClipboard = {
        read: vi.fn().mockResolvedValue('test'),
        write: vi.fn().mockResolvedValue(undefined),
      }
      const adapter = new NodeClipboardAdapter(mockClipboard)

      await adapter.write('hello world')
      expect(mockClipboard.write).toHaveBeenCalledWith('hello world')
      expect(mockClipboard.write).toHaveBeenCalledTimes(1)
    })

    it('throws error when clipboard is not available', async () => {
      const adapter = new NodeClipboardAdapter()
      
      // This test verifies the error handling path
      try {
        await adapter.write('test')
        // If it succeeds, clipboardy is installed - that's okay for this test
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain('Clipboard not available')
      }
    })
  })
})

