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
 * Detected terminal background mode.
 * @public
 */
export type TerminalBackground = "dark" | "light" | "unknown";

/**
 * Detect whether the terminal is using a dark or light background.
 * Uses multiple heuristics in order of reliability:
 * 1. COLORFGBG environment variable (most reliable when present)
 * 2. TERM_BACKGROUND environment variable
 * 3. COLORTERM / TERM_PROGRAM hints (less reliable)
 * @public
 */
export function getTerminalBackground(): TerminalBackground {
  // COLORFGBG is the most reliable indicator when present
  // Format: "fg;bg" where bg < 7 typically means dark, bg >= 7 means light
  const colorFgBg = process.env.COLORFGBG;
  if (colorFgBg) {
    const parts = colorFgBg.split(";");
    const bg = parseInt(parts[parts.length - 1] ?? "", 10);
    if (!isNaN(bg)) {
      // Standard ANSI colors: 0-6 are dark, 7+ (white) is light
      // 256-color: 0-7 dark, 8-15 bright versions
      return bg < 7 || (bg >= 8 && bg < 16 && bg !== 15) ? "dark" : "light";
    }
  }

  // Some terminals set TERM_BACKGROUND directly
  const termBackground = process.env.TERM_BACKGROUND?.toLowerCase();
  if (termBackground === "dark" || termBackground === "light") {
    return termBackground;
  }

  // macOS Terminal.app and iTerm2 default to dark themes commonly
  // but this is a weak heuristic
  const termProgram = process.env.TERM_PROGRAM ?? "";
  if (/iTerm/i.test(termProgram)) {
    // iTerm2's default is dark, but users can change it
    // We'll assume dark as it's more common
    return "dark";
  }

  // VS Code integrated terminal
  if (process.env.TERM_PROGRAM === "vscode") {
    // VS Code defaults to matching the editor theme
    // Most devs use dark themes, but this is just a guess
    return "dark";
  }

  // COLORTERM=truecolor just indicates color capability, not theme
  // We can't determine background from this alone

  return "unknown";
}

/**
 * Check if the terminal appears to be using a dark background.
 * Returns true if dark or unknown (dark is a safer default for contrast).
 */
function isDarkTerminal(): boolean {
  const bg = getTerminalBackground();
  // Default to dark when unknown - it's more common and safer for contrast
  return bg !== "light";
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
  const preferDark = isDarkTerminal();
  return preferDark ? (input.dark ?? input.light) : (input.light ?? input.dark);
}
