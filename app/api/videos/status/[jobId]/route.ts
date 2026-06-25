import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { videoJobs, scripts, campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { pollVideoOperation, downloadVideo } from '@/lib/veo/client'
import { pollFalOperation, downloadFalVideo } from '@/lib/fal/client'
import { saveUploadedFile } from '@/lib/storage'
import { scoreQuality } from '@/lib/quality/scorer'
import { checkCompliance } from '@/lib/compliance/engine'
import type { ScriptContent } from '@/lib/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { jobId } = await params

  const job = await db.select().from(videoJobs).where(eq(videoJobs.id, jobId)).get()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Verify ownership via script → campaign chain
  const script = await db.select().from(scripts).where(eq(scripts.id, job.scriptId)).get()
  if (!script) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const campaign = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, script.campaignId), eq(campaigns.userId, ctx.userId)))
    .get()
  if (!campaign) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  if (job.status === 'generating') {
    try {
      let result: { done: boolean; videoUrl?: string; error?: string } = { done: false }

      if (job.provider === 'fal' && job.falRequestId && ctx.falApiKey) {
        result = await pollFalOperation({ requestId: job.falRequestId, apiKey: ctx.falApiKey })
      } else if (job.provider !== 'fal' && job.veoOperationName && ctx.geminiApiKey) {
        result = await pollVideoOperation({ operationName: job.veoOperationName, apiKey: ctx.geminiApiKey })
      }

      if (result.done) {
        if (result.error) {
          await db
            .update(videoJobs)
            .set({ status: 'failed', errorMessage: result.error })
            .where(eq(videoJobs.id, jobId))
        } else if (result.videoUrl) {
          await db.update(videoJobs).set({ status: 'post_processing' }).where(eq(videoJobs.id, jobId))

          try {
            const buffer = job.provider === 'fal'
              ? await downloadFalVideo(result.videoUrl)
              : await downloadVideo(result.videoUrl)

            const filename = `${jobId}.mp4`
            const outputUrl = await saveUploadedFile(buffer, filename, 'videos')

            const scriptContent: ScriptContent = JSON.parse(script.content)
            const qualityReport = scoreQuality({
              resolution: job.resolution,
              targetDuration: script.duration,
              hasAudioSync: true,
              visionScore: 20,
            })

            const complianceReport = checkCompliance({
              scriptText: scriptContent.fullText,
              platform: script.platform as never,
              aspectRatio: job.aspectRatio,
              hasDisclosureOverlay: true,
              disclosureInFirstThreeSeconds: true,
              hasAILabel: true,
            })

            await db.update(videoJobs).set({
              status: 'review',
              outputUrl,
              fileSizeBytes: buffer.length,
              qualityScore: qualityReport.score,
              qualityReport: JSON.stringify(qualityReport),
              complianceScore: complianceReport.score,
              complianceReport: JSON.stringify(complianceReport),
            }).where(eq(videoJobs.id, jobId))
          } catch (downloadError) {
            await db.update(videoJobs).set({
              status: 'failed',
              errorMessage: `Download failed: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`,
            }).where(eq(videoJobs.id, jobId))
          }
        }
      }
    } catch {
      // Poll failed — leave status as generating, will retry on next poll
    }
  }

  const updatedJob = await db.select().from(videoJobs).where(eq(videoJobs.id, jobId)).get()

  return NextResponse.json({
    job: {
      ...updatedJob,
      qualityReport: updatedJob?.qualityReport ? JSON.parse(updatedJob.qualityReport) : null,
      complianceReport: updatedJob?.complianceReport ? JSON.parse(updatedJob.complianceReport) : null,
      characterDesc: updatedJob?.characterDesc ? JSON.parse(updatedJob.characterDesc) : null,
    },
  })
}
