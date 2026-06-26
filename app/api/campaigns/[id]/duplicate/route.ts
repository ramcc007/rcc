import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { id } = await params
  const source = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, ctx.userId)))
    .get()

  if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const newId = uuidv4()
  await db.insert(campaigns).values({
    id: newId,
    userId: ctx.userId,
    name: `Copy of ${source.name}`,
    productName: source.productName,
    productCategory: source.productCategory,
    targetAudience: source.targetAudience,
    brandVoice: source.brandVoice,
    competitorNames: source.competitorNames,
    brandKitId: source.brandKitId,
    status: 'draft',
  })

  const created = await db.select().from(campaigns).where(eq(campaigns.id, newId)).get()
  return NextResponse.json({ campaign: created }, { status: 201 })
}
