import { db } from '@/lib/db'
import { apiErrors } from '@/lib/db/schema'

export async function logError(userId: string, route: string, error: unknown) {
  try {
    const msg = error instanceof Error ? error.message : String(error)
    // Keep detail to 2000 chars so it fits in the UI
    const detail = msg.length > 200 ? msg : undefined
    const summary = msg.length > 200 ? msg.slice(0, 200) + '…' : msg
    await db.insert(apiErrors).values({ userId, route, errorMessage: summary, errorDetail: detail ?? msg })
  } catch {
    // Never let logging crash the caller
  }
}
