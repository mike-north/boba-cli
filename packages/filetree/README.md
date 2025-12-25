> **Deprecation Notice:** This package is being renamed from `@suds-cli/filetree` to `@boba-cli/filetree`. Please update your dependencies accordingly.

# @suds-cli/filetree

Navigable file tree browser component for Boba terminal UIs.

## Features

- Keyboard navigation (up/down)
- Scrollable viewport
- File metadata display (date, permissions, size)
- Hidden file support
- Customizable key bindings and styles

## Installation

```bash
pnpm add @boba-cli/filetree
```

## Usage

```typescript
import { FiletreeModel } from '@boba-cli/filetree'
import { Program } from '@boba-cli/tea'

const filetree = FiletreeModel.new({
  currentDir: process.cwd(),
  showHidden: false,
})

const program = new Program(filetree)
await program.run()
```

## API

See the [API documentation](../../docs/api/filetree.md) for detailed information.
