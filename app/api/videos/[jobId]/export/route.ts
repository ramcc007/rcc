import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { videoJobs, scripts, campaigns, videoExports } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const ExportSchema = z.object({
  format: z.enum(['mp4', 'webm', 'mov']).default('mp4'),
  resolution: z.enum(['720p', '1080p', '4k']).default('1080p'),
  platform: z.string().optional(),
  withOverlays: z.boolean().default(true),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { jobId } = await params
  const job = await db.select().from(videoJobs).where(eq(videoJobs.id, jobId)).get()
  if (!job || !job.outputUrl) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const script = await db.select().from(scripts).where(eq(scripts.id, job.scriptId)).get()
  const campaign = script
    ? await db
        .select()
        .from(campaigns)
        .where(and(eq(campaigns.id, script.campaignId), eq(campaigns.userId, ctx.userId)))
        .get()
    : null

  if (!campaign) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const parsed = ExportSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  // For MVP, record the export and return the existing URL
  const exportId = uuidv4()
  await db.insert(videoExports).values({
    id: exportId,
    videoJobId: jobId,
    format: parsed.data.format,
    resolution: parsed.data.resolution,
    platform: parsed.data.platform ?? null,
    withOverlays: parsed.data.withOverlays,
    exportedUrl: job.outputUrl,
  })

  await db.update(videoJobs).set({ status: 'exported' }).where(eq(videoJobs.id, jobId))

  return NextResponse.json({
    exportId,
    downloadUrl: job.outputUrl,
    filename: `ugc-video-${jobId.slice(0, 8)}.${parsed.data.format}`,
  })
}
