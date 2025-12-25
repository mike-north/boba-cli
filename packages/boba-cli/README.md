# boba-cli

**The complete Boba CLI framework in one package.**

This is the "kitchen sink" package that includes all Boba CLI components. It's perfect for quick prototyping or when you want everything available without managing multiple imports.

## Installation

```bash
pnpm add boba-cli
```

## Usage

```typescript
import {
  // Core runtime (flat exports)
  Program,
  KeyMsg,
  KeyType,
  quit,
  type Model,
  type Cmd,
  type Msg,

  // Styling (flat exports)
  Style,
  borderStyles,

  // Key bindings (flat exports)
  newBinding,
  matches,

  // Components (namespaced)
  spinner,
  progress,
  textinput,
  list,
  table,
  viewport,
} from 'boba-cli'

// Use namespaced components
const mySpinner = new spinner.SpinnerModel({ spinner: spinner.dot })
const myProgress = progress.ProgressModel.withDefaultGradient({ width: 40 })
const myInput = textinput.TextInputModel.new({ placeholder: 'Enter name...' })
```

## Export Structure

### Flat Exports (direct access)

The core packages are exported flat for convenience:

- `@boba-cli/tea` - Runtime (Program, KeyMsg, quit, etc.)
- `@boba-cli/chapstick` - Styling (Style, borderStyles, etc.)
- `@boba-cli/key` - Key binding utilities (newBinding, matches, etc.)

### Namespaced Exports (via namespace)

Components and utilities are namespaced to avoid conflicts:

```typescript
import { spinner, progress, list, table } from 'boba-cli'

// Access via namespace
spinner.SpinnerModel
spinner.dot
spinner.TickMsg

progress.ProgressModel

list.ListModel
list.DefaultItem

table.TableModel
```

### Available Namespaces

| Namespace | Package | Description |
|-----------|---------|-------------|
| `spinner` | `@boba-cli/spinner` | Animated loading spinners |
| `progress` | `@boba-cli/progress` | Progress bars with gradients |
| `textinput` | `@boba-cli/textinput` | Single-line text input |
| `textarea` | `@boba-cli/textarea` | Multi-line text editor |
| `table` | `@boba-cli/table` | Data tables with scrolling |
| `list` | `@boba-cli/list` | Filterable lists |
| `viewport` | `@boba-cli/viewport` | Scrollable content |
| `paginator` | `@boba-cli/paginator` | Pagination |
| `timer` | `@boba-cli/timer` | Countdown timer |
| `stopwatch` | `@boba-cli/stopwatch` | Elapsed time counter |
| `help` | `@boba-cli/help` | Help key bindings display |
| `filepicker` | `@boba-cli/filepicker` | File browser |
| `filetree` | `@boba-cli/filetree` | File tree view |
| `cursor` | `@boba-cli/cursor` | Blinking cursor |
| `statusbar` | `@boba-cli/statusbar` | Status bar |
| `code` | `@boba-cli/code` | Syntax-highlighted code viewer |
| `markdown` | `@boba-cli/markdown` | Markdown renderer |
| `icons` | `@boba-cli/icons` | File/folder icons |
| `runeutil` | `@boba-cli/runeutil` | Text/grapheme utilities |
| `filesystem` | `@boba-cli/filesystem` | File system operations |
| `machine` | `@boba-cli/machine` | Platform abstraction |
| `dsl` | `@boba-cli/dsl` | Declarative component DSL |

## When to use this package

Use `boba-cli` when:

- You want quick access to all components without multiple imports
- You're prototyping and don't want to think about which packages to install
- Bundle size isn't a concern for your use case

## When to use individual packages

For production applications where bundle size matters, consider importing from individual packages:

```typescript
import { Program, KeyMsg } from '@boba-cli/tea'
import { SpinnerModel, dot } from '@boba-cli/spinner'
import { Style } from '@boba-cli/chapstick'
```

This allows tree-shaking to remove unused code and results in smaller bundles.

## License

MIT
