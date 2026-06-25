import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { scripts, campaigns, videoJobs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { initiateVideoGeneration } from '@/lib/veo/client'
import { buildVeoPromptFromScript } from '@/lib/gemini/prompts'
import { checkVideoRateLimit } from '@/lib/rate-limit'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import type { ScriptContent } from '@/lib/types'

const GenerateVideoSchema = z.object({
  scriptId: z.string(),
  aspectRatio: z.enum(['9:16', '16:9', '1:1']),
  resolution: z.enum(['720p', '1080p', '4k']).default('1080p'),
  characterDesc: z.object({
    ageRange: z.string(),
    ethnicity: z.string(),
    gender: z.string(),
    persona: z.enum(['professional', 'casual', 'authentic']),
  }),
  referenceImageUrls: z.array(z.string()).default([]),
  generateDisclosureOverlay: z.boolean().default(true),
  generateAILabel: z.boolean().default(true),
  disclosureTiming: z.enum(['beginning', 'end', 'throughout']).default('beginning'),
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

  if (!checkVideoRateLimit(ctx.userId)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Maximum 10 video generations per hour.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const parsed = GenerateVideoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const script = await db.select().from(scripts).where(eq(scripts.id, parsed.data.scriptId)).get()
  if (!script) return NextResponse.json({ error: 'Script not found' }, { status: 404 })

  const campaign = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, script.campaignId), eq(campaigns.userId, ctx.userId)))
    .get()
  if (!campaign) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const scriptContent: ScriptContent = JSON.parse(script.content)
  const firstScene = scriptContent.sceneBreakdown[0]

  const veoPrompt = buildVeoPromptFromScript(
    campaign.productName,
    firstScene ?? {
      sceneNumber: 1,
      duration: script.duration,
      visualDescription: scriptContent.fullText,
      voiceover: scriptContent.fullText,
    },
    parsed.data.characterDesc,
    script.platform,
    script.tone
  )

  const jobId = uuidv4()

  // Create job record immediately
  await db.insert(videoJobs).values({
    id: jobId,
    scriptId: script.id,
    aspectRatio: parsed.data.aspectRatio,
    resolution: parsed.data.resolution,
    characterDesc: JSON.stringify(parsed.data.characterDesc),
    referenceImageUrls: JSON.stringify(parsed.data.referenceImageUrls),
    status: 'queued',
  })

  // Initiate async Veo generation (non-blocking)
  initiateVideoGeneration({
    prompt: veoPrompt,
    aspectRatio: parsed.data.aspectRatio,
    apiKey: ctx.geminiApiKey,
  })
    .then(async ({ operationName }) => {
      await db
        .update(videoJobs)
        .set({ veoOperationName: operationName, status: 'generating' })
        .where(eq(videoJobs.id, jobId))
    })
    .catch(async (error) => {
      await db
        .update(videoJobs)
        .set({
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Video generation failed to start',
        })
        .where(eq(videoJobs.id, jobId))
    })

  return NextResponse.json({ jobId }, { status: 202 })
}
