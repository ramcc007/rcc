import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns, scripts, videoJobs } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const userId = session?.user?.id ?? ''
  const { id } = await params

  const campaign = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
    .get()

  if (!campaign) notFound()

  const campaignScripts = await db
    .select()
    .from(scripts)
    .where(eq(scripts.campaignId, id))
    .orderBy(desc(scripts.createdAt))

  // Get video jobs for these scripts
  const allJobs = campaignScripts.length > 0
    ? await db
        .select({ job: videoJobs, scriptPlatform: scripts.platform })
        .from(videoJobs)
        .innerJoin(scripts, eq(videoJobs.scriptId, scripts.id))
        .where(eq(scripts.campaignId, id))
        .orderBy(desc(videoJobs.createdAt))
    : []

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/campaigns" className="text-[#a3a3a3] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
          <p className="text-[#a3a3a3] text-sm mt-0.5">
            {campaign.productName} · <span className="capitalize">{campaign.productCategory}</span>
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Video
        </Link>
      </div>

      {/* Brief */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-3">Campaign Brief</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-[#555]">Target Audience:</span> <span className="text-[#a3a3a3] ml-1">{campaign.targetAudience}</span></div>
          {campaign.brandVoice && <div><span className="text-[#555]">Brand Voice:</span> <span className="text-[#a3a3a3] ml-1">{campaign.brandVoice}</span></div>}
          <div><span className="text-[#555]">Created:</span> <span className="text-[#a3a3a3] ml-1">{formatDate(campaign.createdAt)}</span></div>
          <div><span className="text-[#555]">Scripts:</span> <span className="text-[#a3a3a3] ml-1">{campaignScripts.length}</span></div>
        </div>
      </div>

      {/* Videos */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Videos ({allJobs.length})</h2>
        {allJobs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#2a2a2a] rounded-xl">
            <p className="text-[#a3a3a3] text-sm">No videos generated for this campaign yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allJobs.map(({ job, scriptPlatform }) => (
              <div key={job.id} className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm text-white">{job.aspectRatio} · {job.resolution}</p>
                  <p className="text-xs text-[#555] capitalize">{scriptPlatform} · {formatDate(job.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {job.qualityScore != null && (
                    <span className="text-xs text-[#a3a3a3]">Quality: {Math.round(job.qualityScore)}</span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
