import supportsColor from "supports-color";
import type { ColorInput } from "./types.js";

/**
 * Color support levels. The `level` property indicates the maximum color support available.
 * @public
 */
export interface ColorSupport {
  level: number;
  hasBasic: boolean;
  has256: boolean;
  has16m: boolean;
}

/**
 * Detect terminal color support levels.
 * @public
 */
export function getColorSupport(): ColorSupport {
  const stdout = (
    supportsColor as unknown as { stdout?: StdoutSupport | false | undefined }
  )?.stdout;
  if (!stdout || typeof stdout.level !== "number") {
    return { level: 0, hasBasic: false, has256: false, has16m: false };
  }
  const level = stdout.level ?? 0;
  return {
    level,
    hasBasic: level >= 1,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

interface StdoutSupport {
  level?: number;
}

/**
 * Resolve a color input (string or adaptive light/dark) to a hex string when available.
 * @public
 */
export function resolveColor(input?: ColorInput): string | undefined {
  if (!input) {
    return undefined;
  }
  if (typeof input === "string") {
    return input;
  }
  const support = getColorSupport();
  const preferDark = support.level >= 1 && isDarkTerminal();
  return preferDark ? (input.dark ?? input.light) : (input.light ?? input.dark);
}

function isDarkTerminal(): boolean {
  // Heuristic: use COLORTERM or TERM_PROGRAM settings as hints; default to false.
  const termProgram = process.env.TERM_PROGRAM ?? "";
  const colorterm = process.env.COLORTERM ?? "";
  if (/truecolor/i.test(colorterm)) {
    return true;
  }
  if (/Apple_Terminal/i.test(termProgram) || /iTerm/i.test(termProgram)) {
    return true;
  }
  return false;
}
