// Entry point for @suds/chapstick.
export type {
  Align,
  BorderStyle,
  ColorInput,
  StyleOptions,
  Spacing,
} from "./types.js";
export { borderStyles, defaultBorderStyle } from "./borders.js";
export { getColorSupport, resolveColor, type ColorSupport } from "./colors.js";
export { width, clampWidth, wrapWidth, padLines } from "./measure.js";
export { Style } from "./style.js";
export { joinHorizontal, joinVertical, place } from "./join.js";
