import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { campaigns, scripts, videoJobs } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const CreateCampaignSchema = z.object({
  name: z.string().min(1),
  productName: z.string().min(1),
  productCategory: z.string().min(1),
  targetAudience: z.string().min(1),
  brandVoice: z.string().optional(),
  competitorNames: z.array(z.string()).optional(),
  brandKitId: z.string().optional(),
})

export async function GET() {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const rows = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      productName: campaigns.productName,
      productCategory: campaigns.productCategory,
      targetAudience: campaigns.targetAudience,
      status: campaigns.status,
      brandKitId: campaigns.brandKitId,
      createdAt: campaigns.createdAt,
      updatedAt: campaigns.updatedAt,
    })
    .from(campaigns)
    .where(eq(campaigns.userId, ctx.userId))
    .orderBy(desc(campaigns.createdAt))

  return NextResponse.json({ campaigns: rows })
}

export async function POST(request: NextRequest) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const body = await request.json()
  const parsed = CreateCampaignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const id = uuidv4()
  await db.insert(campaigns).values({
    id,
    userId: ctx.userId,
    name: parsed.data.name,
    productName: parsed.data.productName,
    productCategory: parsed.data.productCategory,
    targetAudience: parsed.data.targetAudience,
    brandVoice: parsed.data.brandVoice ?? null,
    competitorNames: parsed.data.competitorNames ? JSON.stringify(parsed.data.competitorNames) : null,
    brandKitId: parsed.data.brandKitId ?? null,
    status: 'active',
  })

  const campaign = await db.select().from(campaigns).where(eq(campaigns.id, id)).get()
  return NextResponse.json({ campaign }, { status: 201 })
}
