# @suds-cli/dsl

## 0.1.0-alpha.1

### Minor Changes

- [#41](https://github.com/mike-north/boba-cli/pull/41) [`b499f15`](https://github.com/mike-north/boba-cli/commit/b499f15d35675af1e740d92468da921344dda321) Thanks [@mike-north](https://github.com/mike-north)! - Add declarative DSL for building CLI applications with minimal boilerplate

  Introduces a SwiftUI-inspired builder API that reduces typical application code by 65-76% compared to raw TEA while maintaining full type safety through phantom types.

  Key features:
  - Fluent builder pattern: `.state()`, `.component()`, `.onKey()`, `.view()`, `.build()`
  - View DSL primitives: `text`, `vstack`, `hstack`, `spacer`, `divider`
  - Conditional rendering helpers: `when`, `choose`, `map`
  - Component builders for `spinner` and `textInput` with automatic lifecycle management
  - Event context API with `state`, `update`, `setState`, `quit` methods
  - Full TypeScript inference without requiring type annotations

- [`91d1441`](https://github.com/mike-north/boba-cli/commit/91d144145cacb3b0464ea244ad05a61a2b83bd0f) Thanks [@mike-north](https://github.com/mike-north)! - Deprecate @suds-cli/_ packages in favor of @boba-cli/_

  All packages in this scope are being renamed from `@suds-cli/*` to `@boba-cli/*`. Please update your dependencies to use the new package names.

### Patch Changes

- Updated dependencies [[`91d1441`](https://github.com/mike-north/boba-cli/commit/91d144145cacb3b0464ea244ad05a61a2b83bd0f)]:
  - @suds-cli/chapstick@0.1.0-alpha.2
  - @suds-cli/key@0.1.0-alpha.1
  - @suds-cli/spinner@0.1.0-alpha.2
  - @suds-cli/tea@0.1.0-alpha.1
  - @suds-cli/textinput@0.1.0-alpha.2
