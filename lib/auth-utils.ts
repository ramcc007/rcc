import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { decryptApiKey } from '@/lib/crypto'
import { NextResponse } from 'next/server'

export interface AuthContext {
  userId: string
  geminiApiKey: string | null
}

export async function requireAuth(): Promise<AuthContext | NextResponse> {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.select().from(users).where(eq(users.id, session.user.id)).get()

  let geminiApiKey: string | null = null
  if (user?.encryptedGeminiKey) {
    try {
      geminiApiKey = decryptApiKey(user.encryptedGeminiKey)
    } catch {
      geminiApiKey = null
    }
  }

  return { userId: session.user.id, geminiApiKey }
}

export function isAuthError(result: AuthContext | NextResponse): result is NextResponse {
  return result instanceof NextResponse
}
