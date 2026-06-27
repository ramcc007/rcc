import { NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { apiErrors } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const errors = await db
    .select()
    .from(apiErrors)
    .where(eq(apiErrors.userId, ctx.userId))
    .orderBy(desc(apiErrors.createdAt))
    .limit(50)

  return NextResponse.json({ errors })
}

export async function DELETE() {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  await db.delete(apiErrors).where(eq(apiErrors.userId, ctx.userId))
  return NextResponse.json({ success: true })
}
