import chalk from "chalk";
import { defaultBorderStyle } from "./borders.js";
import { resolveColor } from "./colors.js";
import { clampWidth, width as textWidth, wrapWidth } from "./measure.js";
import type {
  Align,
  BorderStyle,
  ColorInput,
  Spacing,
  StyleOptions,
} from "./types.js";

type PaddingInput = number | Partial<Spacing>;
type MarginInput = number | Partial<Spacing>;

/**
 * Fluent style builder for terminal strings.
 * @public
 */
export class Style {
  private readonly options: StyleOptions;

  constructor(options: StyleOptions = {}) {
    this.options = { ...options };
  }

  copy(): Style {
    return new Style(structuredClone(this.options));
  }

  inherit(other: Style): Style {
    return new Style({ ...this.options, ...(other?.options ?? {}) });
  }

  foreground(color: ColorInput): Style {
    return this.with({ foreground: color });
  }

  background(color: ColorInput): Style {
    return this.with({ background: color });
  }

  bold(value = true): Style {
    return this.with({ bold: value });
  }

  italic(value = true): Style {
    return this.with({ italic: value });
  }

  underline(value = true): Style {
    return this.with({ underline: value });
  }

  strikethrough(value = true): Style {
    return this.with({ strikethrough: value });
  }

  padding(all: number): Style;
  padding(vertical: number, horizontal: number): Style;
  padding(top: number, right: number, bottom: number, left: number): Style;
  padding(
    input: PaddingInput,
    right?: number,
    bottom?: number,
    left?: number,
  ): Style {
    const next = normalizeSpacing(input, right, bottom, left);
    return this.with({ padding: { ...this.options.padding, ...next } });
  }

  margin(all: number): Style;
  margin(vertical: number, horizontal: number): Style;
  margin(top: number, right: number, bottom: number, left: number): Style;
  margin(
    input: MarginInput,
    right?: number,
    bottom?: number,
    left?: number,
  ): Style {
    const next = normalizeSpacing(input, right, bottom, left);
    return this.with({ margin: { ...this.options.margin, ...next } });
  }

  width(value: number): Style {
    return this.with({ width: value });
  }

  height(value: number): Style {
    return this.with({ height: value });
  }

  maxWidth(value: number): Style {
    return this.with({ maxWidth: value });
  }

  maxHeight(value: number): Style {
    return this.with({ maxHeight: value });
  }

  border(style: BorderStyle = defaultBorderStyle): Style {
    return this.with({ borderStyle: style });
  }

  borderStyle(style: BorderStyle): Style {
    return this.with({ borderStyle: style });
  }

  borderForeground(color: ColorInput): Style {
    return this.with({ borderColor: color });
  }

  align(value: Align): Style {
    return this.with({ align: value });
  }

  inline(value = true): Style {
    return this.with({ inline: value });
  }

  render(text: string): string {
    const opts = this.options;
    const targetWidth = opts.width ?? opts.maxWidth;
    const hasBorder =
      opts.borderStyle !== undefined || opts.borderColor !== undefined;
    const padding = normalizeSpacing(opts.padding ?? 0);
    const borderWidth = hasBorder ? 2 : 0;
    const innerTargetWidth =
      targetWidth !== undefined
        ? Math.max(0, targetWidth - padding.left - padding.right - borderWidth)
        : undefined;

    let content = text ?? "";
    if (opts.maxWidth && innerTargetWidth !== undefined) {
      content = wrapWidth(content, innerTargetWidth);
    }
    if (opts.width && opts.width > 0 && innerTargetWidth !== undefined) {
      content = clampWidth(content, innerTargetWidth);
    }

    const lines: string[] = content.split("\n");
    const aligned = alignLines(lines, opts.align, innerTargetWidth);

    const padded = applySpacing(aligned, padding);
    const borderStyle = opts.borderStyle ?? defaultBorderStyle;
    const bordered = hasBorder
      ? applyBorder(padded, borderStyle, opts.borderColor)
      : padded;
    const sized = applyHeight(bordered, opts.height, opts.maxHeight);
    const colored = applyTextStyle(sized, opts);
    const withMargin = applySpacing(
      colored,
      normalizeSpacing(opts.margin ?? 0),
    ).join("\n");

    return withMargin;
  }

  private with(patch: Partial<StyleOptions>): Style {
    return new Style({ ...this.options, ...patch });
  }
}

function normalizeSpacing(
  input: PaddingInput,
  right?: number,
  bottom?: number,
  left?: number,
): Spacing {
  if (typeof input === "number") {
    const v = input;
    if (right === undefined && bottom === undefined && left === undefined) {
      return { top: v, right: v, bottom: v, left: v };
    }
    if (right !== undefined && bottom === undefined && left === undefined) {
      return { top: v, right, bottom: v, left: right };
    }
    return {
      top: v,
      right: right ?? 0,
      bottom: bottom ?? 0,
      left: left ?? 0,
    };
  }
  return {
    top: input.top ?? 0,
    right: input.right ?? 0,
    bottom: input.bottom ?? 0,
    left: input.left ?? 0,
  };
}

function alignLines(
  lines: string[],
  align: Align | undefined,
  targetWidth?: number,
): string[] {
  if (!align) {
    return lines;
  }
  const maxLineWidth = lines.reduce(
    (acc, line) => Math.max(acc, textWidth(line)),
    0,
  );
  const width = targetWidth ?? maxLineWidth;
  return lines.map((line) => {
    const w = textWidth(line);
    const space = Math.max(0, width - w);
    switch (align) {
      case "center": {
        const left = Math.floor(space / 2);
        const right = space - left;
        return `${" ".repeat(left)}${line}${" ".repeat(right)}`;
      }
      case "right":
        return `${" ".repeat(space)}${line}`;
      case "left":
      default:
        return `${line}${" ".repeat(space)}`;
    }
  });
}

function applySpacing(lines: string[], spacing: Spacing): string[] {
  const { top, right, bottom, left } = spacing;
  const spaceLeft = " ".repeat(Math.max(0, left));
  const spaceRight = " ".repeat(Math.max(0, right));
  const spaced = lines.map((line) => `${spaceLeft}${line}${spaceRight}`);
  const maxWidth = spaced.reduce(
    (acc, line) => Math.max(acc, textWidth(line)),
    0,
  );
  const empty = " ".repeat(maxWidth);
  const withTop = Array.from({ length: Math.max(0, top) }, () => empty).concat(
    spaced,
  );
  return withTop.concat(
    Array.from({ length: Math.max(0, bottom) }, () => empty),
  );
}

function applyBorder(
  lines: string[],
  style: BorderStyle,
  borderColor?: ColorInput,
): string[] {
  if (!style) return lines;
  const widthMax = lines.reduce(
    (acc, line) => Math.max(acc, textWidth(line)),
    0,
  );
  const top = style.top.repeat(Math.max(0, widthMax));
  const bottom = style.bottom.repeat(Math.max(0, widthMax));

  const wrap = (line: string) => `${style.left}${line}${style.right}`;
  const sidePadded = lines.map((line) => {
    const pad = Math.max(0, widthMax - textWidth(line));
    return wrap(`${line}${" ".repeat(pad)}`);
  });

  const topLine = `${style.topLeft}${top}${style.topRight}`;
  const bottomLine = `${style.bottomLeft}${bottom}${style.bottomRight}`;

  const withBorder = [topLine, ...sidePadded, bottomLine];

  if (!borderColor) {
    return withBorder;
  }
  const colored = applyColor(withBorder.join("\n"), borderColor);
  return colored.split("\n");
}

function applyHeight(
  lines: string[],
  height?: number,
  maxHeight?: number,
): string[] {
  let result = [...lines];
  if (height !== undefined && height > 0) {
    if (result.length < height) {
      const widthMax = Math.max(...result.map(textWidth), 0);
      const blank = " ".repeat(widthMax);
      result = result.concat(Array(height - result.length).fill(blank));
    } else if (result.length > height) {
      result = result.slice(0, height);
    }
  }
  if (maxHeight !== undefined && maxHeight > 0 && result.length > maxHeight) {
    result = result.slice(0, maxHeight);
  }
  return result;
}

function applyTextStyle(lines: string[], opts: StyleOptions): string[] {
  const fg = resolveColor(opts.foreground);
  const bg = resolveColor(opts.background);
  const base = chalk;

  const styleFn = (input: string) => {
    let instance = base;
    if (fg) instance = instance.hex(fg);
    if (bg) instance = instance.bgHex(bg);
    if (opts.bold) instance = instance.bold;
    if (opts.italic) instance = instance.italic;
    if (opts.underline) instance = instance.underline;
    if (opts.strikethrough) instance = instance.strikethrough;
    return instance(input);
  };

  return lines.map(styleFn);
}

function applyColor(text: string, color: ColorInput): string {
  const resolved = resolveColor(color);
  if (!resolved) return text;
  const c = chalk.hex(resolved);
  return text
    .split("\n")
    .map((line) => c(line))
    .join("\n");
}
