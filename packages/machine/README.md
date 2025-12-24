# @suds-cli/machine

Platform abstraction layer for Suds terminal UIs. This package enables Suds applications to run in both Node.js and browser environments (with xterm.js) by providing platform-agnostic interfaces for terminal I/O, clipboard access, environment detection, and signal handling.

## Installation

```bash
npm install @suds-cli/machine
```

### Optional Peer Dependencies

For Node.js usage:

```bash
npm install clipboardy supports-color
```

For browser usage:

```bash
npm install @xterm/xterm
```

## Usage

### Node.js

```typescript
import { createNodePlatform } from '@suds-cli/machine/node'

const platform = createNodePlatform()

// Subscribe to terminal input
const inputDisposable = platform.terminal.onInput((data) => {
  console.log('Received:', data)
})

// Write to terminal
platform.terminal.write('Hello, World!\n')

// Get terminal size
const { columns, rows } = platform.terminal.getSize()

// Enable raw mode for key-by-key input
platform.terminal.enableRawMode()

// Handle signals
platform.signals.onInterrupt(() => {
  console.log('Interrupted!')
  platform.dispose()
})

// Read from clipboard
const text = await platform.clipboard.read()

// Detect color support
const colorSupport = platform.environment.getColorSupport()
if (colorSupport.has16m) {
  // Use true color
}

// Clean up when done
platform.dispose()
```

### Browser (with xterm.js)

```typescript
import { Terminal } from '@xterm/xterm'
import { createBrowserPlatform } from '@suds-cli/machine/browser'

// Create xterm.js terminal
const terminal = new Terminal()
terminal.open(document.getElementById('terminal')!)

// Create platform adapter
const platform = createBrowserPlatform({ terminal })

// Use the same API as Node.js
platform.terminal.onInput((data) => {
  // Handle input
})

platform.terminal.write('Hello from the browser!')

// Clean up
platform.dispose()
```

### Platform-Agnostic Code

Write code that works on both platforms:

```typescript
import type { PlatformAdapter } from '@suds-cli/machine'

function runApp(platform: PlatformAdapter) {
  const { columns, rows } = platform.terminal.getSize()

  platform.terminal.onInput((data) => {
    // Handle input bytes
  })

  platform.terminal.onResize((size) => {
    // Handle resize
  })

  platform.terminal.write(`Terminal size: ${columns}x${rows}\n`)
}
```

## Byte Utilities

The package provides cross-platform byte utilities as a replacement for Node.js `Buffer`:

```typescript
import {
  encodeString,
  decodeString,
  byteLength,
  concatBytes,
  decodeFirstRune,
} from '@suds-cli/machine'

// Encode string to UTF-8 bytes
const bytes = encodeString('Hello, 世界!')

// Decode bytes to string
const text = decodeString(bytes)

// Get byte length of a string
const len = byteLength('Hello') // 5

// Concatenate byte arrays
const combined = concatBytes(bytes1, bytes2, bytes3)

// Decode first UTF-8 character
const [char, byteLen] = decodeFirstRune(bytes)
```

## ANSI Escape Sequences

Platform-agnostic ANSI escape sequence constants and utilities:

```typescript
import {
  CURSOR_SHOW,
  CURSOR_HIDE,
  CLEAR_SCREEN,
  ALT_SCREEN_ON,
  ALT_SCREEN_OFF,
  cursorTo,
  fgRGB,
  bgRGB,
  setWindowTitle,
} from '@suds-cli/machine'

// Use constants directly
terminal.write(CURSOR_HIDE)
terminal.write(CLEAR_SCREEN)
terminal.write(ALT_SCREEN_ON)

// Use utility functions
terminal.write(cursorTo(10, 5))
terminal.write(fgRGB(255, 128, 64))
terminal.write(setWindowTitle('My App'))
```

## API Reference

### Interfaces

#### `PlatformAdapter`

Complete platform adapter combining all platform-specific functionality:

- `terminal: TerminalAdapter` - Terminal I/O adapter
- `signals: SignalAdapter` - Signal handling adapter
- `clipboard: ClipboardAdapter` - Clipboard operations adapter
- `environment: EnvironmentAdapter` - Environment access adapter
- `dispose(): void` - Clean up all resources

#### `TerminalAdapter`

Terminal I/O interface:

- `onInput(handler): Disposable` - Subscribe to input data
- `onResize(handler): Disposable` - Subscribe to resize events
- `write(data: string): void` - Write to terminal output
- `getSize(): TerminalSize` - Get current terminal dimensions
- `enableRawMode(): void` - Enable raw input mode
- `disableRawMode(): void` - Disable raw input mode
- `isTTY(): boolean` - Check if terminal is a TTY

#### `SignalAdapter`

Signal handling interface:

- `onInterrupt(handler): Disposable` - Handle SIGINT/beforeunload
- `onTerminate(handler): Disposable` - Handle SIGTERM/pagehide

#### `ClipboardAdapter`

Clipboard operations interface:

- `read(): Promise<string>` - Read text from clipboard
- `write(text: string): Promise<void>` - Write text to clipboard
- `isAvailable(): boolean` - Check if clipboard is available

#### `EnvironmentAdapter`

Environment access interface:

- `get(name: string): string | undefined` - Get environment variable
- `getColorSupport(): ColorSupport` - Detect color support level
- `getTerminalBackground(): TerminalBackground` - Detect dark/light mode

### Types

#### `TerminalSize`

```typescript
interface TerminalSize {
  readonly columns: number
  readonly rows: number
}
```

#### `ColorSupport`

```typescript
interface ColorSupport {
  readonly level: number    // 0-3
  readonly hasBasic: boolean // 16 colors
  readonly has256: boolean   // 256 colors
  readonly has16m: boolean   // True color (16 million)
}
```

#### `TerminalBackground`

```typescript
type TerminalBackground = 'dark' | 'light' | 'unknown'
```

## Exports

The package has three entry points:

- `@suds-cli/machine` - Core interfaces, byte utilities, and ANSI sequences
- `@suds-cli/machine/node` - Node.js adapter implementations
- `@suds-cli/machine/browser` - Browser/xterm.js adapter implementations

## License

MIT
