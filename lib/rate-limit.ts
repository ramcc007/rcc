interface Window {
  timestamps: number[]
}

const store = new Map<string, Window>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const cutoff = now - windowMs

  let window = store.get(key)
  if (!window) {
    window = { timestamps: [] }
    store.set(key, window)
  }

  // Evict timestamps outside the window
  window.timestamps = window.timestamps.filter(t => t > cutoff)

  if (window.timestamps.length >= limit) return false

  window.timestamps.push(now)
  return true
}

// Convenience wrappers for the two rate-limited endpoints
export function checkScriptRateLimit(userId: string) {
  return rateLimit(`script:${userId}`, 20, 60 * 60 * 1000) // 20 per hour
}

export function checkVideoRateLimit(userId: string) {
  return rateLimit(`video:${userId}`, 10, 60 * 60 * 1000) // 10 per hour
}
