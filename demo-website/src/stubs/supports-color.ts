/**
 * Stub for supports-color package in browser environment.
 * Returns no color support to prevent errors.
 */

export function supportsColor() {
  return false
}

export default {
  supportsColor() {
    return false
  },
  stdout: false,
  stderr: false,
}
