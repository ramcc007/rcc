import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { decryptApiKey } from '@/lib/crypto'
import { NextResponse } from 'next/server'

export interface AuthContext {
  userId: string
  groqApiKey: string | null
  geminiApiKey: string | null
  falApiKey: string | null
}

export async function requireAuth(): Promise<AuthContext | NextResponse> {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.select().from(users).where(eq(users.id, session.user.id)).get()

  let groqApiKey: string | null = null
  if (user?.encryptedGroqKey) {
    try {
      groqApiKey = decryptApiKey(user.encryptedGroqKey)
    } catch {
      groqApiKey = null
    }
  }

  let geminiApiKey: string | null = null
  if (user?.encryptedGeminiKey) {
    try {
      geminiApiKey = decryptApiKey(user.encryptedGeminiKey)
    } catch {
      geminiApiKey = null
    }
  }

  let falApiKey: string | null = null
  if (user?.encryptedFalKey) {
    try {
      falApiKey = decryptApiKey(user.encryptedFalKey)
    } catch {
      falApiKey = null
    }
  }

  return { userId: session.user.id, groqApiKey, geminiApiKey, falApiKey }
}

export function isAuthError(result: AuthContext | NextResponse): result is NextResponse {
  return result instanceof NextResponse
}
