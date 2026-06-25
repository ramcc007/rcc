import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { encryptApiKey, decryptApiKey } from '@/lib/crypto'

describe('encryptApiKey / decryptApiKey', () => {
  it('roundtrip: decrypted value matches original', () => {
    const original = 'AIzaSy-test-key-12345'
    expect(decryptApiKey(encryptApiKey(original))).toBe(original)
  })

  it('produces different ciphertext on each call (random IV)', () => {
    const key = 'same-api-key'
    expect(encryptApiKey(key)).not.toBe(encryptApiKey(key))
  })

  it('encrypted format is iv:authTag:ciphertext (3 hex parts)', () => {
    const parts = encryptApiKey('test').split(':')
    expect(parts).toHaveLength(3)
    // IV: 12 bytes → 24 hex chars
    expect(parts[0]).toHaveLength(24)
    // Auth tag: 16 bytes → 32 hex chars
    expect(parts[1]).toHaveLength(32)
    // Ciphertext: non-empty hex
    expect(parts[2].length).toBeGreaterThan(0)
  })

  it('handles empty string input', () => {
    expect(decryptApiKey(encryptApiKey(''))).toBe('')
  })

  it('handles a long API key', () => {
    const long = 'A'.repeat(200)
    expect(decryptApiKey(encryptApiKey(long))).toBe(long)
  })

  it('handles unicode characters', () => {
    const unicode = '日本語テスト🔑'
    expect(decryptApiKey(encryptApiKey(unicode))).toBe(unicode)
  })

  it('throws when ciphertext is tampered', () => {
    const parts = encryptApiKey('my-api-key').split(':')
    parts[2] = parts[2].split('').reverse().join('')
    expect(() => decryptApiKey(parts.join(':'))).toThrow()
  })

  it('throws when auth tag is tampered', () => {
    const parts = encryptApiKey('my-api-key').split(':')
    parts[1] = 'ff'.repeat(16)
    expect(() => decryptApiKey(parts.join(':'))).toThrow()
  })

  describe('fallback key behavior', () => {
    const originalKey = process.env.ENCRYPTION_KEY

    beforeEach(() => {
      delete process.env.ENCRYPTION_KEY
    })

    afterEach(() => {
      if (originalKey !== undefined) {
        process.env.ENCRYPTION_KEY = originalKey
      }
    })

    it('encrypts and decrypts successfully with fallback all-zero key', () => {
      const value = 'test-fallback-key'
      expect(decryptApiKey(encryptApiKey(value))).toBe(value)
    })
  })
})
