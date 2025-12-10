import stringWidth from 'string-width'

// Try to import from terminal-reflowjs, fall back to local implementations
let reflowTruncate: ((s: string, width: number) => string) | undefined
let reflowWordwrap: ((s: string, limit: number) => string) | undefined

try {
  // Dynamic import would be cleaner but requires async
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const reflowjs: Record<string, unknown> = require('terminal-reflowjs')
  if (typeof reflowjs.truncate === 'function') {
    reflowTruncate = reflowjs.truncate as (s: string, width: number) => string
  }
  if (typeof reflowjs.wordwrap === 'function') {
    reflowWordwrap = reflowjs.wordwrap as (s: string, limit: number) => string
  }
} catch {
  // terminal-reflowjs not available, will use fallback implementations
}

/**
 * Compute ANSI-aware display width.
 * @public
 */
export function width(text: string): number {
  return stringWidth(String(text ?? ''))
}

/**
 * Truncate a single line to maxWidth, ANSI-aware.
 */
function truncateLine(line: string, maxWidth: number): string {
  if (width(line) <= maxWidth) {
    return line
  }

  // Character-by-character truncation for proper ANSI handling
  let acc = ''
  let inAnsi = false

  for (const ch of line) {
    if (ch === '\x1b') {
      inAnsi = true
      acc += ch
      continue
    }

    if (inAnsi) {
      acc += ch
      // ANSI sequences end with a letter
      if (/[a-zA-Z]/.test(ch)) {
        inAnsi = false
      }
      continue
    }

    const nextWidth = width(acc + ch)
    if (nextWidth > maxWidth) {
      break
    }
    acc += ch
  }

  return acc
}

/**
 * Truncate text to a maximum width per line, ANSI-aware.
 * @public
 */
export function clampWidth(text: string, maxWidth?: number): string {
  if (!maxWidth || maxWidth < 1) {
    return text
  }

  if (reflowTruncate) {
    return text
      .split('\n')
      .map((line) => reflowTruncate(line, maxWidth))
      .join('\n')
  }

  // Fallback implementation
  return text
    .split('\n')
    .map((line) => truncateLine(line, maxWidth))
    .join('\n')
}

/**
 * Simple word wrap implementation.
 * Wraps at word boundaries (spaces).
 */
function simpleWordwrap(text: string, maxWidth: number): string {
  const lines = text.split('\n')
  const result: string[] = []

  for (const line of lines) {
    if (width(line) <= maxWidth) {
      result.push(line)
      continue
    }

    const words = line.split(/(\s+)/)
    let currentLine = ''

    for (const word of words) {
      if (!word) continue

      const testLine = currentLine + word

      if (width(testLine) <= maxWidth) {
        currentLine = testLine
      } else {
        if (currentLine.trim()) {
          result.push(currentLine.trimEnd())
        }
        // If the word itself is longer than maxWidth, we need to break it
        if (width(word.trim()) > maxWidth) {
          let remaining = word.trim()
          while (width(remaining) > maxWidth) {
            const truncated = truncateLine(remaining, maxWidth)
            result.push(truncated)
            remaining = remaining.slice(truncated.length)
          }
          currentLine = remaining
        } else {
          currentLine = word.trimStart()
        }
      }
    }

    if (currentLine.trim()) {
      result.push(currentLine.trimEnd())
    }
  }

  return result.join('\n')
}

/**
 * Wrap text to a maximum width, ANSI-aware.
 * @public
 */
export function wrapWidth(text: string, maxWidth?: number): string {
  if (!maxWidth || maxWidth < 1) {
    return text
  }

  if (reflowWordwrap) {
    return reflowWordwrap(text, maxWidth)
  }

  // Fallback implementation
  return simpleWordwrap(text, maxWidth)
}

/**
 * Pad every line with left/right spaces.
 * @public
 */
export function padLines(text: string, left = 0, right = 0): string {
  if (left === 0 && right === 0) {
    return text
  }
  const padLeft = ' '.repeat(Math.max(0, left))
  const padRight = ' '.repeat(Math.max(0, right))
  return text
    .split('\n')
    .map((line) => `${padLeft}${line}${padRight}`)
    .join('\n')
}
