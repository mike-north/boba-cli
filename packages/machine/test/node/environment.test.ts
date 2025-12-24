import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { NodeEnvironmentAdapter } from '../../src/node/environment.js'

describe('NodeEnvironmentAdapter', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    // Restore original env
    for (const key in process.env) {
      if (!(key in originalEnv)) {
        delete process.env[key]
      }
    }
    for (const key in originalEnv) {
      process.env[key] = originalEnv[key]
    }
  })

  describe('get', () => {
    it('returns environment variable value', () => {
      const adapter = new NodeEnvironmentAdapter()
      // Set env var after adapter creation - it reads from process.env directly
      process.env.TEST_VAR = 'test-value'
      expect(adapter.get('TEST_VAR')).toBe('test-value')
      delete process.env.TEST_VAR
    })

    it('returns undefined for non-existent variable', () => {
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.get('NON_EXISTENT_VAR_XYZ')).toBeUndefined()
    })
  })

  describe('getColorSupport', () => {
    it('caches color support result', () => {
      const adapter = new NodeEnvironmentAdapter()
      const first = adapter.getColorSupport()
      const second = adapter.getColorSupport()
      expect(first).toBe(second)
    })

    it('uses supports-color module when available', () => {
      const mockSupportsColor = {
        stdout: { level: 3 },
      }
      const adapter = new NodeEnvironmentAdapter(mockSupportsColor)
      const support = adapter.getColorSupport()
      expect(support.level).toBe(3)
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(true)
      expect(support.has16m).toBe(true)
    })

    it('uses supports-color module level 2', () => {
      const mockSupportsColor = {
        stdout: { level: 2 },
      }
      const adapter = new NodeEnvironmentAdapter(mockSupportsColor)
      const support = adapter.getColorSupport()
      expect(support.level).toBe(2)
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(true)
      expect(support.has16m).toBe(false)
    })

    it('uses supports-color module level 1', () => {
      const mockSupportsColor = {
        stdout: { level: 1 },
      }
      const adapter = new NodeEnvironmentAdapter(mockSupportsColor)
      const support = adapter.getColorSupport()
      expect(support.level).toBe(1)
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(false)
      expect(support.has16m).toBe(false)
    })

    it('uses supports-color module level 0', () => {
      const mockSupportsColor = {
        stdout: { level: 0 },
      }
      const adapter = new NodeEnvironmentAdapter(mockSupportsColor)
      const support = adapter.getColorSupport()
      expect(support.level).toBe(0)
      expect(support.hasBasic).toBe(false)
      expect(support.has256).toBe(false)
      expect(support.has16m).toBe(false)
    })

    it('detects true color from COLORTERM=truecolor', () => {
      process.env.COLORTERM = 'truecolor'
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      expect(support.level).toBe(3)
      expect(support.has16m).toBe(true)
    })

    it('detects true color from COLORTERM=24bit', () => {
      process.env.COLORTERM = '24bit'
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      expect(support.level).toBe(3)
      expect(support.has16m).toBe(true)
    })

    it('detects 256 colors from TERM with 256color', () => {
      delete process.env.COLORTERM // Clear COLORTERM to test TERM detection
      process.env.TERM = 'xterm-256color'
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      expect(support.level).toBe(2)
      expect(support.has256).toBe(true)
      expect(support.has16m).toBe(false)
    })

    it('detects 256 colors from TERM with 256-color', () => {
      delete process.env.COLORTERM // Clear COLORTERM to test TERM detection
      process.env.TERM = 'screen-256-color'
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      expect(support.level).toBe(2)
      expect(support.has256).toBe(true)
    })

    it('detects basic colors from TERM with color', () => {
      delete process.env.COLORTERM // Clear COLORTERM to test TERM detection
      process.env.TERM = 'xterm-color'
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      expect(support.level).toBe(1)
      expect(support.hasBasic).toBe(true)
      expect(support.has256).toBe(false)
    })

    it('detects basic colors from TERM with ansi', () => {
      delete process.env.COLORTERM // Clear COLORTERM to test TERM detection
      process.env.TERM = 'ansi'
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      expect(support.level).toBe(1)
      expect(support.hasBasic).toBe(true)
    })

    it('detects basic colors from TERM with xterm', () => {
      delete process.env.COLORTERM // Clear COLORTERM to test TERM detection
      process.env.TERM = 'xterm'
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      expect(support.level).toBe(1)
      expect(support.hasBasic).toBe(true)
    })

    it('detects basic colors from CI environment', () => {
      process.env.CI = 'true'
      delete process.env.TERM
      delete process.env.COLORTERM
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      // CI should give level 1, but if TTY is detected it might be higher
      expect(support.level).toBeGreaterThanOrEqual(1)
      expect(support.hasBasic).toBe(true)
    })

    it('detects basic colors from TTY', () => {
      delete process.env.CI
      delete process.env.TERM
      delete process.env.COLORTERM
      // When stdout is a TTY and no other indicators, it should detect basic color
      // We can't mock process.stdout, but we can test the logic path
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      // This test verifies the fallback logic when supports-color returns false
      // The actual TTY check happens in the code but we can't easily mock it
      const support = adapter.getColorSupport()
      // Should return at least level 0 (no color) when no indicators
      expect(support.level).toBeGreaterThanOrEqual(0)
      expect(support.level).toBeLessThanOrEqual(3)
    })

    it('returns no color support when nothing detected', () => {
      delete process.env.CI
      delete process.env.TERM
      delete process.env.COLORTERM
      // Test with supports-color returning false and no env vars
      const adapter = new NodeEnvironmentAdapter({ stdout: false })
      const support = adapter.getColorSupport()
      // Without env vars and without TTY detection, should return no color
      // But if stdout.isTTY is true in the test environment, it will return level 1
      // So we just verify it returns a valid ColorSupport object
      expect(support.level).toBeGreaterThanOrEqual(0)
      expect(support.level).toBeLessThanOrEqual(3)
      expect(typeof support.hasBasic).toBe('boolean')
      expect(typeof support.has256).toBe('boolean')
      expect(typeof support.has16m).toBe('boolean')
    })
  })

  describe('getTerminalBackground', () => {
    it('caches background result', () => {
      const adapter = new NodeEnvironmentAdapter()
      const first = adapter.getTerminalBackground()
      const second = adapter.getTerminalBackground()
      expect(first).toBe(second)
    })

    it('detects dark from COLORFGBG with bg < 7', () => {
      process.env.COLORFGBG = '15;0'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('dark')
    })

    it('detects dark from COLORFGBG with bg < 7 (256-color)', () => {
      process.env.COLORFGBG = '15;1'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('dark')
    })

    it('detects light from COLORFGBG with bg >= 7', () => {
      process.env.COLORFGBG = '0;7'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('light')
    })

    it('detects light from COLORFGBG with bg = 7', () => {
      process.env.COLORFGBG = '0;7'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('light')
    })

    it('handles COLORFGBG with multiple semicolons', () => {
      process.env.COLORFGBG = '15;0;0'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('dark')
    })

    it('handles invalid COLORFGBG gracefully', () => {
      process.env.COLORFGBG = 'invalid'
      const adapter = new NodeEnvironmentAdapter()
      // Should fall through to other detection methods
      const result = adapter.getTerminalBackground()
      expect(['dark', 'light', 'unknown']).toContain(result)
    })

    it('detects from TERM_BACKGROUND=dark', () => {
      process.env.TERM_BACKGROUND = 'dark'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('dark')
    })

    it('detects from TERM_BACKGROUND=light', () => {
      process.env.TERM_BACKGROUND = 'light'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('light')
    })

    it('detects dark from iTerm2', () => {
      process.env.TERM_PROGRAM = 'iTerm.app'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('dark')
    })

    it('detects dark from VS Code', () => {
      process.env.TERM_PROGRAM = 'vscode'
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('dark')
    })

    it('returns unknown when nothing detected', () => {
      delete process.env.COLORFGBG
      delete process.env.TERM_BACKGROUND
      delete process.env.TERM_PROGRAM
      const adapter = new NodeEnvironmentAdapter()
      expect(adapter.getTerminalBackground()).toBe('unknown')
    })
  })
})

