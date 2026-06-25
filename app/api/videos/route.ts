import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { videoJobs, scripts, campaigns } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const platform = searchParams.get('platform')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const offset = (page - 1) * limit

  // Join video_jobs → scripts → campaigns filtered by userId
  const allCampaigns = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(eq(campaigns.userId, ctx.userId))

  const campaignIds = allCampaigns.map(c => c.id)
  if (campaignIds.length === 0) {
    return NextResponse.json({ videos: [], total: 0, page, limit })
  }

  const allScripts = await db
    .select({ id: scripts.id, platform: scripts.platform, campaignId: scripts.campaignId })
    .from(scripts)
    .where(eq(scripts.campaignId, campaignIds[0]))

  // For simplicity in SQLite without complex joins, fetch all user jobs
  const userScriptIds = (await db
    .select({ id: scripts.id })
    .from(scripts)
    .innerJoin(campaigns, eq(scripts.campaignId, campaigns.id))
    .where(eq(campaigns.userId, ctx.userId))).map(s => s.id)

  if (userScriptIds.length === 0) {
    return NextResponse.json({ videos: [], total: 0, page, limit })
  }

  // Fetch all jobs with their scripts
  const allJobs = await db
    .select({
      job: videoJobs,
      script: {
        id: scripts.id,
        platform: scripts.platform,
        duration: scripts.duration,
        hookType: scripts.hookType,
        campaignId: scripts.campaignId,
      },
      campaignName: campaigns.name,
      productName: campaigns.productName,
    })
    .from(videoJobs)
    .innerJoin(scripts, eq(videoJobs.scriptId, scripts.id))
    .innerJoin(campaigns, eq(scripts.campaignId, campaigns.id))
    .where(eq(campaigns.userId, ctx.userId))
    .orderBy(desc(videoJobs.createdAt))

  let filtered = allJobs
  if (status) filtered = filtered.filter(r => r.job.status === status)
  if (platform) filtered = filtered.filter(r => r.script.platform === platform)

  const total = filtered.length
  const paginated = filtered.slice(offset, offset + limit)

  const videos = paginated.map(r => ({
    ...r.job,
    qualityReport: r.job.qualityReport ? JSON.parse(r.job.qualityReport) : null,
    complianceReport: r.job.complianceReport ? JSON.parse(r.job.complianceReport) : null,
    script: r.script,
    campaignName: r.campaignName,
    productName: r.productName,
  }))

  return NextResponse.json({ videos, total, page, limit })
}
