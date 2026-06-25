import { db } from '@/lib/db'
import { rateLimitLog } from '@/lib/db/schema'
import { and, eq, gt, lt, count } from 'drizzle-orm'

export async function rateLimit(key: string, limit: number, windowSecs: number): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - windowSecs

  try {
    const [row] = await db
      .select({ cnt: count() })
      .from(rateLimitLog)
      .where(and(eq(rateLimitLog.key, key), gt(rateLimitLog.ts, windowStart)))

    if (Number(row.cnt) >= limit) return false

    await db.insert(rateLimitLog).values({ key, ts: now })

    // 10% chance: clean up stale records older than 2× the window
    if (Math.random() < 0.1) {
      await db.delete(rateLimitLog).where(lt(rateLimitLog.ts, windowStart - windowSecs))
    }

    return true
  } catch {
    // Fail open on DB error — prefer availability over lockout
    return true
  }
}

export async function checkScriptRateLimit(userId: string): Promise<boolean> {
  return rateLimit(`script:${userId}`, 20, 3600)
}

export async function checkVideoRateLimit(userId: string): Promise<boolean> {
  return rateLimit(`video:${userId}`, 10, 3600)
}
