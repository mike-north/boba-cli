---
'@boba-cli/chapstick': minor
'@boba-cli/code': minor
'@boba-cli/cursor': minor
'@boba-cli/filepicker': minor
'@boba-cli/filesystem': minor
'@boba-cli/filetree': minor
'@boba-cli/help': minor
'@boba-cli/icons': minor
'@boba-cli/key': minor
'@boba-cli/list': minor
'@boba-cli/machine': minor
'@boba-cli/markdown': minor
'@boba-cli/paginator': minor
'@boba-cli/progress': minor
'@boba-cli/runeutil': minor
'@boba-cli/spinner': minor
'@boba-cli/statusbar': minor
'@boba-cli/stopwatch': minor
'@boba-cli/table': minor
'@boba-cli/tea': minor
'@boba-cli/textarea': minor
'@boba-cli/textinput': minor
'@boba-cli/timer': minor
'@boba-cli/viewport': minor
---

Add dual CJS/ESM builds using tsup bundler

All packages now provide both CommonJS and ESM output with proper TypeScript type declarations for each module system. Package exports are configured with conditional exports for seamless consumption in both CJS and ESM environments.
