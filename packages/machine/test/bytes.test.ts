import { describe, expect, it } from 'vitest'
import {
  allocBytes,
  byteLength,
  bytesEqual,
  concatBytes,
  copyBytes,
  decodeFirstRune,
  decodeString,
  encodeString,
  fromBytes,
  indexOfString,
  sliceBytes,
  startsWith,
  startsWithString,
} from '../src/bytes.js'

describe('encodeString', () => {
  it('encodes ASCII strings', () => {
    const result = encodeString('hello')
    expect(result).toEqual(new Uint8Array([104, 101, 108, 108, 111]))
  })

  it('encodes empty string', () => {
    const result = encodeString('')
    expect(result).toEqual(new Uint8Array([]))
  })

  it('encodes unicode characters', () => {
    const result = encodeString('日本語')
    expect(result.length).toBe(9) // 3 bytes per character
  })

  it('encodes emoji', () => {
    const result = encodeString('😀')
    expect(result.length).toBe(4) // 4 bytes for this emoji
  })
})

describe('decodeString', () => {
  it('decodes ASCII bytes', () => {
    const bytes = new Uint8Array([104, 101, 108, 108, 111])
    expect(decodeString(bytes)).toBe('hello')
  })

  it('decodes empty array', () => {
    expect(decodeString(new Uint8Array([]))).toBe('')
  })

  it('decodes unicode bytes', () => {
    const encoded = encodeString('日本語')
    expect(decodeString(encoded)).toBe('日本語')
  })
})

describe('byteLength', () => {
  it('returns correct length for ASCII', () => {
    expect(byteLength('hello')).toBe(5)
  })

  it('returns zero for empty string', () => {
    expect(byteLength('')).toBe(0)
  })

  it('returns correct length for unicode', () => {
    expect(byteLength('日本語')).toBe(9)
  })

  it('returns correct length for emoji', () => {
    expect(byteLength('😀')).toBe(4)
  })
})

describe('concatBytes', () => {
  it('concatenates multiple arrays', () => {
    const a = new Uint8Array([1, 2, 3])
    const b = new Uint8Array([4, 5])
    const c = new Uint8Array([6])
    const result = concatBytes(a, b, c)
    expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]))
  })

  it('handles empty arrays', () => {
    const a = new Uint8Array([1, 2])
    const b = new Uint8Array([])
    const result = concatBytes(a, b)
    expect(result).toEqual(new Uint8Array([1, 2]))
  })

  it('handles single array', () => {
    const a = new Uint8Array([1, 2, 3])
    const result = concatBytes(a)
    expect(result).toEqual(new Uint8Array([1, 2, 3]))
  })

  it('handles no arrays', () => {
    const result = concatBytes()
    expect(result).toEqual(new Uint8Array([]))
  })
})

describe('allocBytes', () => {
  it('creates zero-filled array of specified size', () => {
    const result = allocBytes(5)
    expect(result.length).toBe(5)
    expect(result).toEqual(new Uint8Array([0, 0, 0, 0, 0]))
  })

  it('creates empty array for size 0', () => {
    const result = allocBytes(0)
    expect(result.length).toBe(0)
  })
})

describe('fromBytes', () => {
  it('creates array from values', () => {
    const result = fromBytes([1, 2, 3, 255])
    expect(result).toEqual(new Uint8Array([1, 2, 3, 255]))
  })

  it('handles empty array', () => {
    const result = fromBytes([])
    expect(result).toEqual(new Uint8Array([]))
  })
})

describe('bytesEqual', () => {
  it('returns true for equal arrays', () => {
    const a = new Uint8Array([1, 2, 3])
    const b = new Uint8Array([1, 2, 3])
    expect(bytesEqual(a, b)).toBe(true)
  })

  it('returns false for different arrays', () => {
    const a = new Uint8Array([1, 2, 3])
    const b = new Uint8Array([1, 2, 4])
    expect(bytesEqual(a, b)).toBe(false)
  })

  it('returns false for different lengths', () => {
    const a = new Uint8Array([1, 2, 3])
    const b = new Uint8Array([1, 2])
    expect(bytesEqual(a, b)).toBe(false)
  })

  it('returns true for empty arrays', () => {
    expect(bytesEqual(new Uint8Array([]), new Uint8Array([]))).toBe(true)
  })
})

describe('startsWith', () => {
  it('returns true when array starts with prefix', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5])
    const prefix = new Uint8Array([1, 2, 3])
    expect(startsWith(bytes, prefix)).toBe(true)
  })

  it('returns false when array does not start with prefix', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5])
    const prefix = new Uint8Array([2, 3])
    expect(startsWith(bytes, prefix)).toBe(false)
  })

  it('returns true for empty prefix', () => {
    const bytes = new Uint8Array([1, 2, 3])
    expect(startsWith(bytes, new Uint8Array([]))).toBe(true)
  })

  it('returns false when prefix is longer than array', () => {
    const bytes = new Uint8Array([1, 2])
    const prefix = new Uint8Array([1, 2, 3])
    expect(startsWith(bytes, prefix)).toBe(false)
  })

  it('returns true when arrays are equal', () => {
    const bytes = new Uint8Array([1, 2, 3])
    expect(startsWith(bytes, bytes)).toBe(true)
  })
})

describe('startsWithString', () => {
  it('returns true when array starts with encoded string', () => {
    const bytes = encodeString('hello world')
    expect(startsWithString(bytes, 'hello')).toBe(true)
  })

  it('returns false when array does not start with string', () => {
    const bytes = encodeString('hello world')
    expect(startsWithString(bytes, 'world')).toBe(false)
  })
})

describe('indexOfString', () => {
  it('finds substring at start', () => {
    const bytes = encodeString('hello world')
    expect(indexOfString(bytes, 'hello')).toBe(0)
  })

  it('finds substring in middle', () => {
    const bytes = encodeString('hello world')
    expect(indexOfString(bytes, 'world')).toBe(6)
  })

  it('returns -1 when not found', () => {
    const bytes = encodeString('hello world')
    expect(indexOfString(bytes, 'foo')).toBe(-1)
  })

  it('respects fromIndex', () => {
    const bytes = encodeString('hello hello')
    expect(indexOfString(bytes, 'hello', 1)).toBe(6)
  })
})

describe('decodeFirstRune', () => {
  it('decodes ASCII character', () => {
    const bytes = encodeString('hello')
    const [char, len] = decodeFirstRune(bytes)
    expect(char).toBe('h')
    expect(len).toBe(1)
  })

  it('decodes unicode character', () => {
    const bytes = encodeString('日本語')
    const [char, len] = decodeFirstRune(bytes)
    expect(char).toBe('日')
    expect(len).toBe(3)
  })

  it('decodes emoji', () => {
    const bytes = encodeString('😀hello')
    const [char, len] = decodeFirstRune(bytes)
    expect(char).toBe('😀')
    expect(len).toBe(4)
  })

  it('returns null for empty array', () => {
    const [char, len] = decodeFirstRune(new Uint8Array([]))
    expect(char).toBeNull()
    expect(len).toBe(0)
  })

  it('respects offset parameter', () => {
    const bytes = encodeString('hello')
    const [char, len] = decodeFirstRune(bytes, 1)
    expect(char).toBe('e')
    expect(len).toBe(1)
  })

  it('returns null for offset beyond length', () => {
    const bytes = encodeString('hi')
    const [char, len] = decodeFirstRune(bytes, 10)
    expect(char).toBeNull()
    expect(len).toBe(0)
  })
})

describe('sliceBytes', () => {
  it('slices from start', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5])
    const result = sliceBytes(bytes, 2)
    expect(result).toEqual(new Uint8Array([3, 4, 5]))
  })

  it('slices with end', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5])
    const result = sliceBytes(bytes, 1, 3)
    expect(result).toEqual(new Uint8Array([2, 3]))
  })

  it('returns empty for invalid range', () => {
    const bytes = new Uint8Array([1, 2, 3])
    const result = sliceBytes(bytes, 5)
    expect(result.length).toBe(0)
  })
})

describe('copyBytes', () => {
  it('creates independent copy', () => {
    const original = new Uint8Array([1, 2, 3])
    const copy = copyBytes(original)
    expect(copy).toEqual(original)
    // Modify original
    original[0] = 99
    // Copy should be unchanged
    expect(copy[0]).toBe(1)
  })
})
