/**
 * Horizontal alignment options for rendered content.
 * @public
 */
export type HAlign = "left" | "center" | "right";

/**
 * Vertical alignment options for rendered content.
 * @public
 */
export type VAlign = "top" | "center" | "bottom";

/**
 * Alias for horizontal alignment (backwards compatibility).
 * @public
 */
export type Align = HAlign;

/**
 * Spacing descriptor for padding or margin.
 * @public
 */
export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Characters used to render borders around content.
 * @public
 */
export interface BorderStyle {
  top: string;
  bottom: string;
  left: string;
  right: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

/**
 * A color string or adaptive light/dark color choice.
 * Accepts hex colors (#ff0000), named colors (red), or adaptive objects.
 * @public
 */
export type ColorInput =
  | string
  | {
      light?: string;
      dark?: string;
    };

/**
 * Options used internally to represent a Style.
 * @public
 */
export interface StyleOptions {
  foreground?: ColorInput;
  background?: ColorInput;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  padding?: Partial<Spacing>;
  margin?: Partial<Spacing>;
  borderStyle?: BorderStyle;
  borderColor?: ColorInput;
  alignHorizontal?: HAlign;
  alignVertical?: VAlign;
  inline?: boolean;
}
