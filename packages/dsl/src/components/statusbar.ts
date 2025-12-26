import type { Cmd, Msg } from '@boba-cli/tea'
import type { ColorInput } from '@boba-cli/chapstick'
import { StatusbarModel, type ColorConfig } from '@boba-cli/statusbar'
import type { ComponentBuilder } from '../types.js'

/**
 * Options for the statusbar component builder.
 *
 * @remarks
 * Configure the color scheme for the four columns of the statusbar.
 * Each column can have independent foreground and background colors.
 *
 * @public
 */
export interface StatusBarBuilderOptions {
  /**
   * Color configuration for the first column.
   *
   * @remarks
   * The first column is left-aligned and truncates if content exceeds
   * 30 characters.
   */
  first: {
    foreground: ColorInput
    background: ColorInput
  }
  /**
   * Color configuration for the second column.
   *
   * @remarks
   * The second column fills the remaining space between the first
   * and third columns, truncating content as needed.
   */
  second: {
    foreground: ColorInput
    background: ColorInput
  }
  /**
   * Color configuration for the third column.
   *
   * @remarks
   * The third column is right-aligned and does not truncate.
   */
  third: {
    foreground: ColorInput
    background: ColorInput
  }
  /**
   * Color configuration for the fourth column.
   *
   * @remarks
   * The fourth column is right-aligned at the edge and does not truncate.
   */
  fourth: {
    foreground: ColorInput
    background: ColorInput
  }
}

/**
 * Create a statusbar component builder.
 *
 * @remarks
 * Creates a `ComponentBuilder` wrapping the `@boba-cli/statusbar` package.
 * The statusbar displays a 4-column layout at the bottom of the screen with
 * customizable colors for each column.
 *
 * The statusbar automatically responds to window resize events and manages
 * column layout and truncation.
 *
 * @example
 * Basic usage with color configuration:
 * ```typescript
 * const app = createApp()
 *   .component('status', statusBar({
 *     first: { foreground: '#ffffff', background: '#5555ff' },
 *     second: { foreground: '#ffffff', background: '#333333' },
 *     third: { foreground: '#ffffff', background: '#555555' },
 *     fourth: { foreground: '#ffffff', background: '#ff5555' }
 *   }))
 *   .update((model, msg) => {
 *     const status = model.components.status
 *       .setContent('App v1.0', 'Ready', 'CPU: 45%', 'MEM: 2.1GB')
 *     return [
 *       { ...model, components: { ...model.components, status } },
 *       null
 *     ]
 *   })
 *   .view(({ components }) => components.status)
 *   .build()
 * ```
 *
 * @example
 * Dynamic content updates:
 * ```typescript
 * const app = createApp()
 *   .component('status', statusBar({
 *     first: { foreground: '#ffffff', background: '#5555ff' },
 *     second: { foreground: '#ffffff', background: '#333333' },
 *     third: { foreground: '#ffffff', background: '#555555' },
 *     fourth: { foreground: '#ffffff', background: '#ff5555' }
 *   }))
 *   .update((model, msg) => {
 *     const timestamp = new Date().toLocaleTimeString()
 *     const status = model.components.status
 *       .setContent('MyApp', msg.type, timestamp, `Items: ${model.items.length}`)
 *     return [
 *       { ...model, components: { ...model.components, status } },
 *       null
 *     ]
 *   })
 *   .view(({ components }) => vstack(
 *     text('Main content area'),
 *     components.status
 *   ))
 *   .build()
 * ```
 *
 * @param options - Color configuration for the four statusbar columns
 * @returns A `ComponentBuilder` ready to use with `AppBuilder.component`
 *
 * @public
 */
export function statusBar(
  options: StatusBarBuilderOptions,
): ComponentBuilder<StatusbarModel> {
  const firstColors: ColorConfig = {
    foreground: options.first.foreground,
    background: options.first.background,
  }
  const secondColors: ColorConfig = {
    foreground: options.second.foreground,
    background: options.second.background,
  }
  const thirdColors: ColorConfig = {
    foreground: options.third.foreground,
    background: options.third.background,
  }
  const fourthColors: ColorConfig = {
    foreground: options.fourth.foreground,
    background: options.fourth.background,
  }

  return {
    init(): [StatusbarModel, Cmd<Msg>] {
      const model = StatusbarModel.new(
        firstColors,
        secondColors,
        thirdColors,
        fourthColors,
      )
      return [model, null]
    },

    update(model: StatusbarModel, msg: Msg): [StatusbarModel, Cmd<Msg>] {
      return model.update(msg)
    },

    view(model: StatusbarModel): string {
      return model.view()
    },
  }
}
