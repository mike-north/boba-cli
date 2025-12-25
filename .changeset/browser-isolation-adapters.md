---
'@boba-cli/machine': minor
'@boba-cli/chapstick': patch
'@boba-cli/code': patch
'@boba-cli/markdown': patch
'@boba-cli/tea': patch
'@boba-cli/filesystem': patch
'@boba-cli/filetree': patch
'@boba-cli/filepicker': patch
---

Isolate Node.js dependencies to @boba-cli/machine for browser compatibility

This change introduces platform abstraction adapters that allow all public packages
(except @boba-cli/machine) to run in browser environments:

**New adapters in @boba-cli/machine:**
- `FileSystemAdapter` - File operations abstraction
- `PathAdapter` - Path manipulation abstraction
- `EnvironmentAdapter` - Environment variable and terminal capability detection
- `StyleFn` - Chalk-like terminal styling (replaces direct chalk usage)
- `ArchiveAdapter` - Archive creation/extraction

**Platform implementations:**
- Node.js: `@boba-cli/machine/node` subpath exports
- Browser: `@boba-cli/machine/browser` subpath exports (stubs/polyfills)

**Breaking changes:**
- `CodeModel.new()` now requires `filesystem` and `path` options
- `MarkdownModel.new()` now requires `filesystem` option
- Packages using file operations must inject adapters
- Direct chalk imports are now blocked by ESLint
