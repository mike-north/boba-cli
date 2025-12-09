import stringWidth from "string-width";

type HAlign = "left" | "center" | "right";
type VAlign = "top" | "center" | "bottom";

/**
 * Join blocks side-by-side, padding heights and inserting spacing columns.
 * @param spacing - The spacing between blocks.
 * @param blocks - The blocks to join.
 * @public
 */
export function joinHorizontal(spacing: number, ...blocks: string[]): string;
/**
 * Join blocks side-by-side, padding heights and inserting spacing columns.
 * @param blocks - The blocks to join.
 * @public
 */
export function joinHorizontal(...blocks: string[]): string;
export function joinHorizontal(
  first: number | string,
  ...rest: string[]
): string {
  const spacing = typeof first === "number" ? first : 0;
  const blocks: string[] = typeof first === "number" ? rest : [first, ...rest];
  if (blocks.length === 0) return "";

  const split = blocks.map((b) => b.split("\n"));
  const widths = split.map((lines) =>
    Math.max(...lines.map((l) => stringWidth(l)), 0),
  );
  const height = Math.max(...split.map((lines) => lines.length));

  const padded = split.map((lines, idx) => {
    const w = widths[idx] ?? 0;
    const missing = height - lines.length;
    const filled = lines.concat(Array(missing).fill(""));
    return filled.map((line) => padToWidth(line, w));
  });

  const gap = " ".repeat(Math.max(0, spacing));
  const rows: string[] = [];
  for (let i = 0; i < height; i++) {
    rows.push(padded.map((col) => col[i] ?? "").join(gap));
  }
  return rows.join("\n");
}

/**
 * Join blocks vertically with optional blank line spacing.
 * @param spacing - The spacing between blocks.
 * @param blocks - The blocks to join.
 * @public
 */
export function joinVertical(spacing: number, ...blocks: string[]): string;
/**
 * Join blocks vertically with optional blank line spacing.
 * @param blocks - The blocks to join.
 * @public
 */
export function joinVertical(...blocks: string[]): string;
export function joinVertical(
  first: number | string,
  ...rest: string[]
): string {
  const spacing = typeof first === "number" ? first : 0;
  const blocks: string[] = typeof first === "number" ? rest : [first, ...rest];
  if (blocks.length === 0) return "";
  const gap = "\n".repeat(Math.max(0, spacing + 1));
  return blocks.join(gap);
}

/**
 * Place content inside a fixed rectangle with alignment.
 * @public
 */
export function place(
  width: number,
  height: number,
  hAlign: HAlign,
  vAlign: VAlign,
  content: string,
): string {
  const lines = content.split("\n");
  const clamped = lines.slice(0, height).map((line) => truncate(line, width));
  const paddedLines = clamped.map((line) => alignLine(line, width, hAlign));
  const missing = height - paddedLines.length;
  const topPad =
    vAlign === "top"
      ? 0
      : vAlign === "center"
        ? Math.floor(missing / 2)
        : missing;
  const bottomPad = missing - topPad;
  const empty = " ".repeat(Math.max(0, width));
  const prefix = padLines(empty, Math.max(0, topPad));
  const suffix = padLines(empty, Math.max(0, bottomPad));
  return [...prefix, ...paddedLines, ...suffix].join("\n");
}

function padLines(line: string, count: number): string[] {
  if (count <= 0) return [];
  return Array<string>(count).fill(line);
}

function padToWidth(input: string, width: number): string {
  const w = stringWidth(input);
  if (w >= width) return input;
  return `${input}${" ".repeat(width - w)}`;
}

function truncate(input: string, maxWidth: number): string {
  const w = stringWidth(input);
  if (w <= maxWidth) return input;
  // naive truncation by characters (adequate for helper)
  let acc = "";
  for (const ch of input) {
    if (stringWidth(acc + ch) > maxWidth) break;
    acc += ch;
  }
  return acc;
}

function alignLine(input: string, width: number, align: HAlign): string {
  const w = stringWidth(input);
  const space = Math.max(0, width - w);
  if (align === "right") {
    return `${" ".repeat(space)}${input}`;
  }
  if (align === "center") {
    const left = Math.floor(space / 2);
    const right = space - left;
    return `${" ".repeat(left)}${input}${" ".repeat(right)}`;
  }
  return `${input}${" ".repeat(space)}`;
}
