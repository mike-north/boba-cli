/**
 * Platform-agnostic byte utilities using Uint8Array.
 * These replace Node.js Buffer operations for cross-platform compatibility.
 * @packageDocumentation
 */

/** Shared TextEncoder instance for string encoding. */
const encoder = new TextEncoder()

/** Shared TextDecoder instance for string decoding. */
const decoder = new TextDecoder('utf-8')

/**
 * Encode a string to UTF-8 bytes.
 * Equivalent to `Buffer.from(text, 'utf8')`.
 * @param text - String to encode
 * @returns UTF-8 encoded bytes
 * @public
 */
export function encodeString(text: string): Uint8Array {
  return encoder.encode(text)
}

/**
 * Decode UTF-8 bytes to a string.
 * Equivalent to `buffer.toString('utf8')`.
 * @param bytes - Bytes to decode
 * @returns Decoded string
 * @public
 */
export function decodeString(bytes: Uint8Array): string {
  return decoder.decode(bytes)
}

/**
 * Get the byte length of a string when encoded as UTF-8.
 * Equivalent to `Buffer.byteLength(text, 'utf8')`.
 * @param text - String to measure
 * @returns Byte length
 * @public
 */
export function byteLength(text: string): number {
  return encoder.encode(text).length
}

/**
 * Concatenate multiple Uint8Arrays into one.
 * Equivalent to `Buffer.concat(arrays)`.
 * @param arrays - Arrays to concatenate
 * @returns Combined array
 * @public
 */
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

/**
 * Create a new Uint8Array of the specified size, filled with zeros.
 * Equivalent to `Buffer.alloc(size)`.
 * @param size - Size of the array
 * @returns New zero-filled array
 * @public
 */
export function allocBytes(size: number): Uint8Array {
  return new Uint8Array(size)
}

/**
 * Create a Uint8Array from an array of byte values.
 * Equivalent to `Buffer.from([...])`.
 * @param values - Byte values (0-255)
 * @returns New Uint8Array
 * @public
 */
export function fromBytes(values: number[]): Uint8Array {
  return new Uint8Array(values)
}

/**
 * Compare two Uint8Arrays for equality.
 * Equivalent to `buffer1.equals(buffer2)`.
 * @param a - First array
 * @param b - Second array
 * @returns True if arrays are equal
 * @public
 */
export function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

/**
 * Check if a byte array starts with a specific prefix.
 * @param bytes - Array to check
 * @param prefix - Prefix to look for
 * @returns True if bytes starts with prefix
 * @public
 */
export function startsWith(bytes: Uint8Array, prefix: Uint8Array): boolean {
  if (bytes.length < prefix.length) {
    return false
  }
  for (let i = 0; i < prefix.length; i++) {
    if (bytes[i] !== prefix[i]) {
      return false
    }
  }
  return true
}

/**
 * Check if a byte array starts with a specific string (UTF-8 encoded).
 * @param bytes - Array to check
 * @param prefix - String prefix to look for
 * @returns True if bytes starts with the encoded prefix
 * @public
 */
export function startsWithString(bytes: Uint8Array, prefix: string): boolean {
  return startsWith(bytes, encodeString(prefix))
}

/**
 * Find the index of a substring within a byte array.
 * Returns -1 if not found.
 * @param bytes - Array to search
 * @param needle - String to find
 * @param fromIndex - Start index (default 0)
 * @returns Index of first occurrence or -1
 * @public
 */
export function indexOfString(
  bytes: Uint8Array,
  needle: string,
  fromIndex: number = 0,
): number {
  const needleBytes = encodeString(needle)
  const endIndex = bytes.length - needleBytes.length

  outer: for (let i = fromIndex; i <= endIndex; i++) {
    for (let j = 0; j < needleBytes.length; j++) {
      if (bytes[i + j] !== needleBytes[j]) {
        continue outer
      }
    }
    return i
  }
  return -1
}

/**
 * Decode the first complete UTF-8 character from a byte array.
 * Returns the character and its byte length, or null if incomplete.
 * @param bytes - Byte array to decode
 * @param offset - Start offset (default 0)
 * @returns Tuple of [character, byteLength] or [null, 0] if incomplete
 * @public
 */
export function decodeFirstRune(
  bytes: Uint8Array,
  offset: number = 0,
): [string | null, number] {
  if (offset >= bytes.length) {
    return [null, 0]
  }

  const firstByte = bytes[offset]
  if (firstByte === undefined) {
    return [null, 0]
  }

  // Determine the byte length of this UTF-8 character
  let byteLen: number
  if ((firstByte & 0x80) === 0) {
    // Single byte character (ASCII)
    byteLen = 1
  } else if ((firstByte & 0xe0) === 0xc0) {
    // Two byte character
    byteLen = 2
  } else if ((firstByte & 0xf0) === 0xe0) {
    // Three byte character
    byteLen = 3
  } else if ((firstByte & 0xf8) === 0xf0) {
    // Four byte character
    byteLen = 4
  } else {
    // Invalid UTF-8 start byte, treat as single byte
    byteLen = 1
  }

  // Check if we have enough bytes
  if (offset + byteLen > bytes.length) {
    return [null, 0]
  }

  // Decode the character
  const slice = bytes.subarray(offset, offset + byteLen)
  const decoded = decoder.decode(slice)

  if (decoded.length === 0) {
    return [null, 0]
  }

  // Use codePointAt to properly handle surrogate pairs (emoji, etc.)
  // This returns the full Unicode code point, not just the first surrogate
  const codePoint = decoded.codePointAt(0)
  if (codePoint === undefined) {
    return [null, 0]
  }

  // Convert the code point back to a string (handles surrogate pairs correctly)
  const firstChar = String.fromCodePoint(codePoint)

  return [firstChar, byteLen]
}

/**
 * Slice a portion of a byte array.
 * Equivalent to `buffer.subarray(start, end)`.
 * @param bytes - Source array
 * @param start - Start index
 * @param end - End index (optional, defaults to length)
 * @returns New Uint8Array view of the slice
 * @public
 */
export function sliceBytes(
  bytes: Uint8Array,
  start: number,
  end?: number,
): Uint8Array {
  return bytes.subarray(start, end)
}

/**
 * Create a copy of a byte array.
 * @param bytes - Array to copy
 * @returns New Uint8Array with copied data
 * @public
 */
export function copyBytes(bytes: Uint8Array): Uint8Array {
  return new Uint8Array(bytes)
}
