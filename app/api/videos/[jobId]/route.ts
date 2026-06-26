import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { videoJobs, scripts, campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const PatchSchema = z.object({
  performanceNotes: z.string().max(2000),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { jobId } = await params
  const body = await request.json()
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  // Verify ownership via campaign
  const row = await db
    .select({ jobId: videoJobs.id })
    .from(videoJobs)
    .innerJoin(scripts, eq(videoJobs.scriptId, scripts.id))
    .innerJoin(campaigns, eq(scripts.campaignId, campaigns.id))
    .where(and(eq(videoJobs.id, jobId), eq(campaigns.userId, ctx.userId)))
    .get()

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db
    .update(videoJobs)
    .set({ performanceNotes: parsed.data.performanceNotes })
    .where(eq(videoJobs.id, jobId))

  return NextResponse.json({ success: true })
}
