import { Style } from '@boba-cli/chapstick'
import type { KeyMap as HelpKeyMap } from '@boba-cli/help'
import type { Binding } from '@boba-cli/key'
import type { FileSystemAdapter, PathAdapter } from '@boba-cli/machine'

/** Metadata for a file system entry. @public */
export interface FileInfo {
  name: string
  path: string
  isDir: boolean
  isHidden: boolean
  size: number
  mode: number
}

/** Keyboard bindings for the filepicker. @public */
export interface FilepickerKeyMap extends HelpKeyMap {
  up: Binding
  down: Binding
  select: Binding
  back: Binding
  open: Binding
  toggleHidden: Binding
  pageUp: Binding
  pageDown: Binding
  gotoTop: Binding
  gotoBottom: Binding
  shortHelp(): Binding[]
  fullHelp(): Binding[][]
}

/** Style hooks for rendering the file list. @public */
export interface FilepickerStyles {
  directory: Style
  file: Style
  hidden: Style
  selected: Style
  cursor: Style
  status: Style
}

/** Options for constructing a {@link FilepickerModel}. @public */
export interface FilepickerOptions {
  /** FileSystem adapter for file operations */
  filesystem: FileSystemAdapter
  /** Path adapter for path operations */
  path: PathAdapter
  currentDir?: string
  allowedTypes?: string[]
  showHidden?: boolean
  showPermissions?: boolean
  showSize?: boolean
  dirFirst?: boolean
  height?: number
  styles?: Partial<FilepickerStyles>
  keyMap?: FilepickerKeyMap
}
