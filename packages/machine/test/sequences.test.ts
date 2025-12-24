import { describe, expect, it } from 'vitest'
import {
  ALT_SCREEN_OFF,
  ALT_SCREEN_ON,
  BEL,
  BRACKETED_PASTE_END,
  BRACKETED_PASTE_OFF,
  BRACKETED_PASTE_ON,
  BRACKETED_PASTE_START,
  CLEAR_LINE,
  CLEAR_SCREEN,
  CSI,
  CURSOR_HIDE,
  CURSOR_HOME,
  CURSOR_SHOW,
  ESC,
  FOCUS_IN,
  FOCUS_OUT,
  MOUSE_ALL_OFF,
  MOUSE_ALL_ON,
  MOUSE_CELL_OFF,
  MOUSE_CELL_ON,
  MOUSE_SGR_OFF,
  MOUSE_SGR_ON,
  REPORT_FOCUS_OFF,
  REPORT_FOCUS_ON,
  RESET,
  bg256,
  bgRGB,
  cursorBackward,
  cursorDown,
  cursorForward,
  cursorTo,
  cursorUp,
  fg256,
  fgRGB,
  scrollDown,
  scrollUp,
  setScrollRegion,
  setWindowTitle,
} from '../src/sequences.js'

describe('escape constants', () => {
  it('defines ESC correctly', () => {
    expect(ESC).toBe('\u001b')
  })

  it('defines CSI correctly', () => {
    expect(CSI).toBe('\u001b[')
  })

  it('defines BEL correctly', () => {
    expect(BEL).toBe('\u0007')
  })
})

describe('cursor control', () => {
  it('shows cursor', () => {
    expect(CURSOR_SHOW).toBe('\u001b[?25h')
  })

  it('hides cursor', () => {
    expect(CURSOR_HIDE).toBe('\u001b[?25l')
  })

  it('moves cursor home', () => {
    expect(CURSOR_HOME).toBe('\u001b[H')
  })

  it('moves cursor to position', () => {
    expect(cursorTo(5, 10)).toBe('\u001b[5;10H')
  })

  it('moves cursor up', () => {
    expect(cursorUp(3)).toBe('\u001b[3A')
    expect(cursorUp()).toBe('\u001b[1A')
  })

  it('moves cursor down', () => {
    expect(cursorDown(2)).toBe('\u001b[2B')
    expect(cursorDown()).toBe('\u001b[1B')
  })

  it('moves cursor forward', () => {
    expect(cursorForward(5)).toBe('\u001b[5C')
    expect(cursorForward()).toBe('\u001b[1C')
  })

  it('moves cursor backward', () => {
    expect(cursorBackward(4)).toBe('\u001b[4D')
    expect(cursorBackward()).toBe('\u001b[1D')
  })
})

describe('screen control', () => {
  it('clears screen', () => {
    expect(CLEAR_SCREEN).toBe('\u001b[2J')
  })

  it('clears line', () => {
    expect(CLEAR_LINE).toBe('\u001b[2K')
  })
})

describe('alternate screen', () => {
  it('enters alternate screen', () => {
    expect(ALT_SCREEN_ON).toBe('\u001b[?1049h')
  })

  it('exits alternate screen', () => {
    expect(ALT_SCREEN_OFF).toBe('\u001b[?1049l')
  })
})

describe('mouse tracking', () => {
  it('enables cell motion', () => {
    expect(MOUSE_CELL_ON).toBe('\u001b[?1002h')
  })

  it('disables cell motion', () => {
    expect(MOUSE_CELL_OFF).toBe('\u001b[?1002l')
  })

  it('enables all motion', () => {
    expect(MOUSE_ALL_ON).toBe('\u001b[?1003h')
  })

  it('disables all motion', () => {
    expect(MOUSE_ALL_OFF).toBe('\u001b[?1003l')
  })

  it('enables SGR mode', () => {
    expect(MOUSE_SGR_ON).toBe('\u001b[?1006h')
  })

  it('disables SGR mode', () => {
    expect(MOUSE_SGR_OFF).toBe('\u001b[?1006l')
  })
})

describe('bracketed paste', () => {
  it('enables bracketed paste', () => {
    expect(BRACKETED_PASTE_ON).toBe('\u001b[?2004h')
  })

  it('disables bracketed paste', () => {
    expect(BRACKETED_PASTE_OFF).toBe('\u001b[?2004l')
  })

  it('defines paste start sequence', () => {
    expect(BRACKETED_PASTE_START).toBe('\u001b[200~')
  })

  it('defines paste end sequence', () => {
    expect(BRACKETED_PASTE_END).toBe('\u001b[201~')
  })
})

describe('focus reporting', () => {
  it('enables focus reporting', () => {
    expect(REPORT_FOCUS_ON).toBe('\u001b[?1004h')
  })

  it('disables focus reporting', () => {
    expect(REPORT_FOCUS_OFF).toBe('\u001b[?1004l')
  })

  it('defines focus in sequence', () => {
    expect(FOCUS_IN).toBe('\u001b[I')
  })

  it('defines focus out sequence', () => {
    expect(FOCUS_OUT).toBe('\u001b[O')
  })
})

describe('window title', () => {
  it('sets window title', () => {
    expect(setWindowTitle('My Title')).toBe('\u001b]0;My Title\u0007')
  })
})

describe('text formatting', () => {
  it('resets formatting', () => {
    expect(RESET).toBe('\u001b[0m')
  })
})

describe('colors', () => {
  it('sets 256 foreground color', () => {
    expect(fg256(196)).toBe('\u001b[38;5;196m')
  })

  it('sets 256 background color', () => {
    expect(bg256(21)).toBe('\u001b[48;5;21m')
  })

  it('sets RGB foreground color', () => {
    expect(fgRGB(255, 128, 64)).toBe('\u001b[38;2;255;128;64m')
  })

  it('sets RGB background color', () => {
    expect(bgRGB(32, 64, 128)).toBe('\u001b[48;2;32;64;128m')
  })
})

describe('scrolling', () => {
  it('scrolls up', () => {
    expect(scrollUp(5)).toBe('\u001b[5S')
    expect(scrollUp()).toBe('\u001b[1S')
  })

  it('scrolls down', () => {
    expect(scrollDown(3)).toBe('\u001b[3T')
    expect(scrollDown()).toBe('\u001b[1T')
  })

  it('sets scroll region', () => {
    expect(setScrollRegion(5, 20)).toBe('\u001b[5;20r')
  })
})
