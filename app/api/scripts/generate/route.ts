import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { campaigns, scripts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateScript } from '@/lib/gemini/script-generator'
import { checkScriptRateLimit } from '@/lib/rate-limit'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const GenerateScriptSchema = z.object({
  campaignId: z.string(),
  filters: z.object({
    hookType: z.string(),
    funnelStage: z.string(),
    ctaType: z.string(),
    tone: z.string(),
    platform: z.string(),
    duration: z.number(),
    persona: z.string(),
  }),
})

export async function POST(request: NextRequest) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  if (!ctx.geminiApiKey) {
    return NextResponse.json(
      { error: 'Gemini API key not configured. Please add your API key in Settings.' },
      { status: 422 }
    )
  }

  if (!await checkScriptRateLimit(ctx.userId)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Maximum 20 script generations per hour.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const parsed = GenerateScriptSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const campaign = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, parsed.data.campaignId), eq(campaigns.userId, ctx.userId)))
    .get()

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  try {
    const scriptContent = await generateScript(
      {
        productName: campaign.productName,
        productCategory: campaign.productCategory as never,
        targetAudience: campaign.targetAudience,
        brandVoice: campaign.brandVoice ?? undefined,
        competitorNames: campaign.competitorNames ? JSON.parse(campaign.competitorNames) : undefined,
        hookType: parsed.data.filters.hookType as never,
        funnelStage: parsed.data.filters.funnelStage as never,
        ctaType: parsed.data.filters.ctaType as never,
        tone: parsed.data.filters.tone as never,
        platform: parsed.data.filters.platform as never,
        duration: parsed.data.filters.duration,
        persona: parsed.data.filters.persona as never,
      },
      ctx.geminiApiKey
    )

    const id = uuidv4()
    await db.insert(scripts).values({
      id,
      campaignId: campaign.id,
      hookType: parsed.data.filters.hookType,
      funnelStage: parsed.data.filters.funnelStage,
      ctaType: parsed.data.filters.ctaType,
      tone: parsed.data.filters.tone,
      platform: parsed.data.filters.platform,
      duration: parsed.data.filters.duration,
      persona: parsed.data.filters.persona,
      content: JSON.stringify(scriptContent),
    })

    return NextResponse.json({ scriptId: id, content: scriptContent }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Script generation failed' },
      { status: 422 }
    )
  }
}
