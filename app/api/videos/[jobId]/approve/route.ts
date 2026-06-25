import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { videoJobs, scripts, campaigns } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { jobId } = await params
  const job = await db.select().from(videoJobs).where(eq(videoJobs.id, jobId)).get()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const script = await db.select().from(scripts).where(eq(scripts.id, job.scriptId)).get()
  const campaign = script
    ? await db
        .select()
        .from(campaigns)
        .where(and(eq(campaigns.id, script.campaignId), eq(campaigns.userId, ctx.userId)))
        .get()
    : null

  if (!campaign) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  if (job.status !== 'review') {
    return NextResponse.json({ error: 'Job must be in review status to approve' }, { status: 400 })
  }

  await db.update(videoJobs).set({ status: 'approved' }).where(eq(videoJobs.id, jobId))
  return NextResponse.json({ success: true, status: 'approved' })
}
