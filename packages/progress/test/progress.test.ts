import { width as textWidth } from '@boba-cli/chapstick'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { interpolateColor } from '../src/gradient.js'
import { FrameMsg } from '../src/messages.js'
import { ProgressModel } from '../src/model.js'

const ANSI_REGEX = /\u001b\[[0-9;]*m/g
function stripAnsi(input: string): string {
  return input.replace(ANSI_REGEX, '')
}

describe('ProgressModel', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('clamps target percent', () => {
    const model = ProgressModel.new()
    const [next] = model.setPercent(2)
    expect(next.targetPercent()).toBe(1)
  })

  it('renders bar width without percentage', () => {
    const model = ProgressModel.new({
      width: 10,
      showPercentage: false,
      full: '#',
      empty: '.',
      fullColor: '#ffffff',
      emptyColor: '#333333',
    })
    const output = model.viewAs(0.4)
    expect(textWidth(output)).toBe(10)
    const bare = stripAnsi(output)
    expect(bare.split('#').length - 1).toBe(4)
    expect(bare.split('.').length - 1).toBe(6)
  })

  it('formats percentage text', () => {
    const model = ProgressModel.new({ percentFormat: ' %.0f%%' })
    const output = model.viewAs(0.5)
    expect(output.trimEnd().endsWith('50%')).toBe(true)
  })

  it('ignores messages for other IDs', () => {
    const model = ProgressModel.new()
    const foreign = new FrameMsg(model.id() + 1, 0, new Date())
    const [next, cmd] = model.update(foreign)
    expect(next).toBe(model)
    expect(cmd).toBeNull()
  })

  it('animates toward target then stops', async () => {
    vi.useFakeTimers()
    let [model, cmd] = ProgressModel.new().setPercent(1)

    let frames = 0
    while (cmd && frames < 200) {
      const promise = cmd()
      vi.runOnlyPendingTimers()
      const msg = await promise
      ;[model, cmd] = model.update(msg)
      frames++
    }

    expect(cmd).toBeNull()
    expect(model.percent()).toBeGreaterThan(0.999)
  })

  it('preserves animation when setPercent called while animating', async () => {
    vi.useFakeTimers()

    // Start animation toward 0.5
    let [model, cmd] = ProgressModel.new().setPercent(0.5)
    expect(cmd).not.toBeNull()

    // Run a few frames to get animation in progress
    for (let i = 0; i < 5 && cmd; i++) {
      const promise = cmd()
      vi.runOnlyPendingTimers()
      const msg = await promise
      ;[model, cmd] = model.update(msg)
    }

    // Animation should still be in progress (not settled yet)
    expect(model.percent()).toBeLessThan(0.5)
    expect(cmd).not.toBeNull()

    // Call setPercent with new target while animating
    const [updated, newCmd] = model.setPercent(0.8)

    // Should NOT schedule a new frame (existing animation continues)
    expect(newCmd).toBeNull()

    // Target should be updated
    expect(updated.targetPercent()).toBe(0.8)

    // Current percent should be preserved (not reset)
    expect(updated.percent()).toBe(model.percent())

    // Continue animation with existing pending frame and verify it reaches new target
    let finalModel = updated
    let pendingCmd = cmd
    let frames = 0
    while (pendingCmd && frames < 200) {
      const promise = pendingCmd()
      vi.runOnlyPendingTimers()
      const msg = await promise
      ;[finalModel, pendingCmd] = finalModel.update(msg)
      frames++
    }

    // Should have animated to the new target (0.8)
    expect(finalModel.percent()).toBeGreaterThan(0.799)
  })
})

describe('gradient', () => {
  it('interpolates colors in RGB space', () => {
    const mid = interpolateColor('#ff0000', '#00ff00', 0.5)
    expect(mid.toLowerCase()).toBe('#808000')
  })
})
