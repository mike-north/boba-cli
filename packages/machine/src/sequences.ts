/**
 * ANSI escape sequences for terminal control.
 * These are platform-agnostic constants that work in any terminal emulator.
 * @packageDocumentation
 */

/** Escape character. @public */
export const ESC = '\u001b'

/** Control Sequence Introducer. @public */
export const CSI = `${ESC}[`

/** Operating System Command. @public */
export const OSC = `${ESC}]`

/** String Terminator. @public */
export const ST = `${ESC}\\`

/** Bell character (alternative string terminator). @public */
export const BEL = '\u0007'

// ============================================================================
// Cursor Control
// ============================================================================

/** Show the cursor. @public */
export const CURSOR_SHOW = `${CSI}?25h`

/** Hide the cursor. @public */
export const CURSOR_HIDE = `${CSI}?25l`

/** Move cursor to home position (1,1). @public */
export const CURSOR_HOME = `${CSI}H`

/**
 * Move cursor to specific position.
 * @param row - Row number (1-based)
 * @param col - Column number (1-based)
 * @returns ANSI escape sequence
 * @public
 */
export function cursorTo(row: number, col: number): string {
  return `${CSI}${row};${col}H`
}

/**
 * Move cursor up by n rows.
 * @param n - Number of rows
 * @returns ANSI escape sequence
 * @public
 */
export function cursorUp(n: number = 1): string {
  return `${CSI}${n}A`
}

/**
 * Move cursor down by n rows.
 * @param n - Number of rows
 * @returns ANSI escape sequence
 * @public
 */
export function cursorDown(n: number = 1): string {
  return `${CSI}${n}B`
}

/**
 * Move cursor forward (right) by n columns.
 * @param n - Number of columns
 * @returns ANSI escape sequence
 * @public
 */
export function cursorForward(n: number = 1): string {
  return `${CSI}${n}C`
}

/**
 * Move cursor backward (left) by n columns.
 * @param n - Number of columns
 * @returns ANSI escape sequence
 * @public
 */
export function cursorBackward(n: number = 1): string {
  return `${CSI}${n}D`
}

/**
 * Save cursor position.
 * @public
 */
export const CURSOR_SAVE = `${CSI}s`

/**
 * Restore cursor position.
 * @public
 */
export const CURSOR_RESTORE = `${CSI}u`

// ============================================================================
// Screen Control
// ============================================================================

/** Clear the entire screen. @public */
export const CLEAR_SCREEN = `${CSI}2J`

/** Clear from cursor to end of screen. @public */
export const CLEAR_SCREEN_DOWN = `${CSI}0J`

/** Clear from cursor to beginning of screen. @public */
export const CLEAR_SCREEN_UP = `${CSI}1J`

/** Clear the entire line. @public */
export const CLEAR_LINE = `${CSI}2K`

/** Clear from cursor to end of line. @public */
export const CLEAR_LINE_END = `${CSI}0K`

/** Clear from cursor to beginning of line. @public */
export const CLEAR_LINE_START = `${CSI}1K`

// ============================================================================
// Alternate Screen Buffer
// ============================================================================

/** Enter alternate screen buffer. @public */
export const ALT_SCREEN_ON = `${CSI}?1049h`

/** Exit alternate screen buffer. @public */
export const ALT_SCREEN_OFF = `${CSI}?1049l`

// ============================================================================
// Mouse Tracking
// ============================================================================

/** Enable cell-motion mouse tracking (button events + motion while pressed). @public */
export const MOUSE_CELL_ON = `${CSI}?1002h`

/** Enable all-motion mouse tracking (button events + all motion). @public */
export const MOUSE_ALL_ON = `${CSI}?1003h`

/** Enable SGR extended mouse mode (supports coordinates \> 223). @public */
export const MOUSE_SGR_ON = `${CSI}?1006h`

/** Disable cell-motion mouse tracking. @public */
export const MOUSE_CELL_OFF = `${CSI}?1002l`

/** Disable all-motion mouse tracking. @public */
export const MOUSE_ALL_OFF = `${CSI}?1003l`

/** Disable SGR extended mouse mode. @public */
export const MOUSE_SGR_OFF = `${CSI}?1006l`

// ============================================================================
// Bracketed Paste
// ============================================================================

/** Enable bracketed paste mode. @public */
export const BRACKETED_PASTE_ON = `${CSI}?2004h`

/** Disable bracketed paste mode. @public */
export const BRACKETED_PASTE_OFF = `${CSI}?2004l`

/** Bracketed paste start sequence. @public */
export const BRACKETED_PASTE_START = `${CSI}200~`

/** Bracketed paste end sequence. @public */
export const BRACKETED_PASTE_END = `${CSI}201~`

// ============================================================================
// Focus Reporting
// ============================================================================

/** Enable focus reporting. @public */
export const REPORT_FOCUS_ON = `${CSI}?1004h`

/** Disable focus reporting. @public */
export const REPORT_FOCUS_OFF = `${CSI}?1004l`

/** Focus gained sequence. @public */
export const FOCUS_IN = `${CSI}I`

/** Focus lost sequence. @public */
export const FOCUS_OUT = `${CSI}O`

// ============================================================================
// Window Control
// ============================================================================

/**
 * Set the terminal window title.
 * @param title - Window title
 * @returns ANSI escape sequence
 * @public
 */
export function setWindowTitle(title: string): string {
  return `${OSC}0;${title}${BEL}`
}

// ============================================================================
// Text Formatting (SGR - Select Graphic Rendition)
// ============================================================================

/** Reset all text attributes. @public */
export const RESET = `${CSI}0m`

/** Bold text. @public */
export const BOLD = `${CSI}1m`

/** Dim/faint text. @public */
export const DIM = `${CSI}2m`

/** Italic text. @public */
export const ITALIC = `${CSI}3m`

/** Underlined text. @public */
export const UNDERLINE = `${CSI}4m`

/** Blinking text. @public */
export const BLINK = `${CSI}5m`

/** Reverse video (swap foreground/background). @public */
export const REVERSE = `${CSI}7m`

/** Hidden text. @public */
export const HIDDEN = `${CSI}8m`

/** Strikethrough text. @public */
export const STRIKETHROUGH = `${CSI}9m`

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Set foreground color using 256-color palette.
 * @param colorIndex - Color index (0-255)
 * @returns ANSI escape sequence
 * @public
 */
export function fg256(colorIndex: number): string {
  return `${CSI}38;5;${colorIndex}m`
}

/**
 * Set background color using 256-color palette.
 * @param colorIndex - Color index (0-255)
 * @returns ANSI escape sequence
 * @public
 */
export function bg256(colorIndex: number): string {
  return `${CSI}48;5;${colorIndex}m`
}

/**
 * Set foreground color using RGB true color.
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns ANSI escape sequence
 * @public
 */
export function fgRGB(r: number, g: number, b: number): string {
  return `${CSI}38;2;${r};${g};${b}m`
}

/**
 * Set background color using RGB true color.
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns ANSI escape sequence
 * @public
 */
export function bgRGB(r: number, g: number, b: number): string {
  return `${CSI}48;2;${r};${g};${b}m`
}

// ============================================================================
// Scrolling
// ============================================================================

/**
 * Scroll up by n lines.
 * @param n - Number of lines
 * @returns ANSI escape sequence
 * @public
 */
export function scrollUp(n: number = 1): string {
  return `${CSI}${n}S`
}

/**
 * Scroll down by n lines.
 * @param n - Number of lines
 * @returns ANSI escape sequence
 * @public
 */
export function scrollDown(n: number = 1): string {
  return `${CSI}${n}T`
}

/**
 * Set scrolling region.
 * @param top - Top row (1-based)
 * @param bottom - Bottom row (1-based)
 * @returns ANSI escape sequence
 * @public
 */
export function setScrollRegion(top: number, bottom: number): string {
  return `${CSI}${top};${bottom}r`
}

/** Reset scrolling region to full screen. @public */
export const RESET_SCROLL_REGION = `${CSI}r`
