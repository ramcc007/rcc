import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { campaigns, scripts, videoJobs } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { z } from 'zod'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { id } = await params
  const campaign = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, ctx.userId)))
    .get()

  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const campaignScripts = await db
    .select()
    .from(scripts)
    .where(eq(scripts.campaignId, id))
    .orderBy(desc(scripts.createdAt))

  const scriptIds = campaignScripts.map(s => s.id)
  const jobs = scriptIds.length > 0
    ? await db
        .select()
        .from(videoJobs)
        .where(eq(videoJobs.scriptId, scriptIds[0]))
        .orderBy(desc(videoJobs.createdAt))
    : []

  return NextResponse.json({
    campaign: {
      ...campaign,
      competitorNames: campaign.competitorNames ? JSON.parse(campaign.competitorNames) : [],
    },
    scripts: campaignScripts,
    recentJobs: jobs,
  })
}

const UpdateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  productName: z.string().min(1).optional(),
  targetAudience: z.string().optional(),
  brandVoice: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateCampaignSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const existing = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, ctx.userId)))
    .get()
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.update(campaigns).set(parsed.data).where(eq(campaigns.id, id))
  const updated = await db.select().from(campaigns).where(eq(campaigns.id, id)).get()
  return NextResponse.json({ campaign: updated })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { id } = await params
  const existing = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, ctx.userId)))
    .get()
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.delete(campaigns).where(eq(campaigns.id, id))
  return NextResponse.json({ success: true })
}
