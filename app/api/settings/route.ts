import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { encryptApiKey } from '@/lib/crypto'
import { testApiKey } from '@/lib/gemini/client'
import { z } from 'zod'

export async function GET() {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const user = await db.select().from(users).where(eq(users.id, ctx.userId)).get()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    hasGeminiKey: !!user.encryptedGeminiKey,
    geminiKeyMasked: user.encryptedGeminiKey ? '••••••••••••••••' : null,
    hasFalKey: !!user.encryptedFalKey,
    falKeyMasked: user.encryptedFalKey ? '••••••••••••••••' : null,
    defaultPlatform: user.defaultPlatform,
    defaultAspectRatio: user.defaultAspectRatio,
  })
}

const UpdateSettingsSchema = z.object({
  geminiApiKey: z.string().optional(),
  falApiKey: z.string().optional(),
  defaultPlatform: z.string().optional(),
  defaultAspectRatio: z.string().optional(),
})

export async function PUT(request: NextRequest) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const body = await request.json()
  const parsed = UpdateSettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const updates: Partial<typeof users.$inferInsert> = {}

  if (parsed.data.geminiApiKey) {
    updates.encryptedGeminiKey = encryptApiKey(parsed.data.geminiApiKey)
  }
  if (parsed.data.falApiKey) {
    updates.encryptedFalKey = encryptApiKey(parsed.data.falApiKey)
  }
  if (parsed.data.defaultPlatform) {
    updates.defaultPlatform = parsed.data.defaultPlatform
  }
  if (parsed.data.defaultAspectRatio) {
    updates.defaultAspectRatio = parsed.data.defaultAspectRatio
  }

  if (Object.keys(updates).length > 0) {
    await db.update(users).set(updates).where(eq(users.id, ctx.userId))
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (key === 'gemini') {
    await db.update(users).set({ encryptedGeminiKey: null }).where(eq(users.id, ctx.userId))
  } else if (key === 'fal') {
    await db.update(users).set({ encryptedFalKey: null }).where(eq(users.id, ctx.userId))
  } else {
    return NextResponse.json({ error: 'Invalid key type' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const body = await request.json()

  if (body.action === 'test-api-key' && body.apiKey) {
    const isValid = await testApiKey(body.apiKey)
    return NextResponse.json({ valid: isValid })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
