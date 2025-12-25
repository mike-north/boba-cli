/**
 * Boba CLI - Complete TUI framework for TypeScript
 *
 * This is the "kitchen sink" package that re-exports all Boba CLI components.
 * For smaller bundle sizes, consider importing from individual packages like
 * `@boba-cli/tea`, `@boba-cli/spinner`, etc.
 *
 * @packageDocumentation
 */

// Core runtime - flat exports for most common types
export * from '@boba-cli/tea'

// Styling - flat exports for styling
export * from '@boba-cli/chapstick'

// Key bindings - flat exports
export * from '@boba-cli/key'

// Components - namespaced to avoid conflicts
export * as spinner from '@boba-cli/spinner'
export * as progress from '@boba-cli/progress'
export * as textinput from '@boba-cli/textinput'
export * as textarea from '@boba-cli/textarea'
export * as table from '@boba-cli/table'
export * as list from '@boba-cli/list'
export * as viewport from '@boba-cli/viewport'
export * as paginator from '@boba-cli/paginator'
export * as timer from '@boba-cli/timer'
export * as stopwatch from '@boba-cli/stopwatch'
export * as help from '@boba-cli/help'
export * as filepicker from '@boba-cli/filepicker'
export * as filetree from '@boba-cli/filetree'
export * as cursor from '@boba-cli/cursor'
export * as statusbar from '@boba-cli/statusbar'
export * as code from '@boba-cli/code'
export * as markdown from '@boba-cli/markdown'
export * as icons from '@boba-cli/icons'

// Utilities - namespaced
export * as runeutil from '@boba-cli/runeutil'
export * as filesystem from '@boba-cli/filesystem'

// Platform abstraction - namespaced
export * as machine from '@boba-cli/machine'

// DSL - namespaced
export * as dsl from '@boba-cli/dsl'
