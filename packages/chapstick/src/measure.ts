import stringWidth from "string-width";
import { reflowText } from "terminal-reflowjs";

type ReflowFn = (
  text: string,
  options: { maxWidth: number; mode: "truncate" | "wrap" },
) => string;
const reflow: ReflowFn =
  typeof reflowText === "function"
    ? (reflowText as ReflowFn)
    : (text, { maxWidth, mode }) => simpleReflow(text, maxWidth, mode);

/**
 * Compute ANSI-aware display width.
 * @public
 */
export function width(text: string): number {
  return stringWidth(String(text ?? ""));
}

/**
 * Truncate text to a maximum width.
 * @public
 */
export function clampWidth(text: string, maxWidth?: number): string {
  if (!maxWidth || maxWidth < 1) {
    return text;
  }
  return reflow(String(text), { maxWidth, mode: "truncate" });
}

/**
 * Wrap text to a maximum width.
 * @public
 */
export function wrapWidth(text: string, maxWidth?: number): string {
  if (!maxWidth || maxWidth < 1) {
    return text;
  }
  return reflow(String(text), { maxWidth, mode: "wrap" });
}

function simpleReflow(
  text: string,
  maxWidth: number,
  mode: "truncate" | "wrap",
): string {
  const lines = text.split("\n");
  return lines
    .map((line) => {
      if (mode === "truncate") {
        return line.slice(0, maxWidth);
      }
      const chunks: string[] = [];
      let remaining = line;
      while (remaining.length > maxWidth) {
        chunks.push(remaining.slice(0, maxWidth));
        remaining = remaining.slice(maxWidth);
      }
      chunks.push(remaining);
      return chunks.join("\n");
    })
    .join("\n");
}

/**
 * Pad every line with left/right spaces.
 * @public
 */
export function padLines(text: string, left = 0, right = 0): string {
  if (left === 0 && right === 0) {
    return text;
  }
  const padLeft = " ".repeat(Math.max(0, left));
  const padRight = " ".repeat(Math.max(0, right));
  return text
    .split("\n")
    .map((line) => `${padLeft}${line}${padRight}`)
    .join("\n");
}
