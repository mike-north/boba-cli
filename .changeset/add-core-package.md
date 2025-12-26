---
"@boba-cli/core": minor
"@boba-cli/machine": minor
"@boba-cli/chapstick": minor
---

Introduce `@boba-cli/core` package for shared types and color detection

This change introduces a new foundational package `@boba-cli/core` that provides:

- **Shared types**: `ColorSupport`, `TerminalBackground`, and `EnvironmentAdapter` interfaces
- **Color detection utilities**: `detectColorSupport()` and `detectTerminalBackground()` functions that auto-detect terminal capabilities from environment variables
- **Auto environment adapter**: `createAutoEnvironmentAdapter()` for creating an environment adapter with auto-detected color support

The architecture is now cleanly layered:
```
@boba-cli/tea (application framework)
    ↓
@boba-cli/chapstick (styling) + @boba-cli/machine (platform I/O)
    ↓
@boba-cli/core (shared types + detection)
```

**Breaking changes**: None. Both `@boba-cli/machine` and `@boba-cli/chapstick` re-export the types from core for backwards compatibility.

**Benefits**:
- Colors now "just work" in Node.js - `createDefaultContext()` auto-detects terminal color capabilities without requiring manual setup
- Each layer is independently useful and testable
- No circular dependencies between packages
- Color detection logic is pure and easily testable
