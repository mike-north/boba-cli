import { Style } from '@boba-cli/chapstick'
import type { Binding } from '@boba-cli/key'

/**
 * Interface for components that provide help bindings.
 * @public
 */
export interface KeyMap {
  /** Bindings for short (single-line) help. */
  shortHelp(): Binding[]
  /** Bindings grouped into columns for full help. */
  fullHelp(): Binding[][]
}

/**
 * Style configuration for help rendering.
 * @public
 */
export interface HelpStyles {
  ellipsis: Style
  shortKey: Style
  shortDesc: Style
  shortSeparator: Style
  fullKey: Style
  fullDesc: Style
  fullSeparator: Style
}
