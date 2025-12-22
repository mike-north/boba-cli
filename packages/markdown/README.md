# @suds-cli/markdown

Markdown viewer component for Suds terminal UIs.

## Features

- Renders markdown with beautiful terminal styling
- Scrollable viewport for long documents
- Automatic light/dark theme detection
- Support for headers, code blocks, lists, links, and more
- Word wrapping at viewport width

## Installation

```bash
pnpm add @suds-cli/markdown
```

## Usage

```typescript
import { MarkdownModel } from '@suds-cli/markdown'
import { Program } from '@suds-cli/tea'

const model = MarkdownModel.new({ active: true })
model = model.setFileName('README.md')

// Handle resize
model = model.setSize(width, height)

// Render
const view = model.view()
```

## API

See the [API documentation](../../docs/markdown.md) for complete details.
