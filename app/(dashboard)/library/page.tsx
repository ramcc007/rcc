import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { videoJobs, scripts, campaigns } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { Library, Video } from 'lucide-react'
import Link from 'next/link'
import { formatDate, getStatusColor, getComplianceBadgeColor } from '@/lib/utils'
import type { ComplianceReport, QualityReport } from '@/lib/types'

export default async function LibraryPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const rows = await db
    .select({
      job: videoJobs,
      platform: scripts.platform,
      duration: scripts.duration,
      campaignName: campaigns.name,
      productName: campaigns.productName,
    })
    .from(videoJobs)
    .innerJoin(scripts, eq(videoJobs.scriptId, scripts.id))
    .innerJoin(campaigns, eq(scripts.campaignId, campaigns.id))
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(videoJobs.createdAt))

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Video Library</h1>
          <p className="text-[#a3a3a3] mt-1">{rows.length} video{rows.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Video className="w-4 h-4" />
          Create Video
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#2a2a2a] rounded-2xl">
          <Library className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No videos yet</p>
          <p className="text-[#a3a3a3] text-sm mb-6">Generated videos will appear here after creation.</p>
          <Link href="/create" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            Create Your First Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rows.map(({ job, platform, duration, campaignName, productName }) => {
            const compliance = job.complianceReport ? JSON.parse(job.complianceReport) as ComplianceReport : null
            const quality = job.qualityReport ? JSON.parse(job.qualityReport) as QualityReport : null

            return (
              <div key={job.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors">
                {/* Thumbnail */}
                <div className="aspect-video bg-[#111] flex items-center justify-center relative">
                  {job.thumbnailUrl ? (
                    <img src={job.thumbnailUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <Video className="w-8 h-8 text-[#333]" />
                  )}
                  <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  <div>
                    <p className="text-sm font-medium text-white truncate">{productName}</p>
                    <p className="text-xs text-[#555] truncate">{campaignName}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-[#262626] text-[#a3a3a3] px-1.5 py-0.5 rounded capitalize">{platform}</span>
                    <span className="text-[10px] bg-[#262626] text-[#a3a3a3] px-1.5 py-0.5 rounded">{job.aspectRatio}</span>
                    <span className="text-[10px] bg-[#262626] text-[#a3a3a3] px-1.5 py-0.5 rounded">{duration}s</span>
                  </div>

                  {(quality || compliance) && (
                    <div className="flex items-center gap-2">
                      {quality && (
                        <span className="text-xs text-[#a3a3a3]">Q: {Math.round(quality.score)}</span>
                      )}
                      {compliance && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getComplianceBadgeColor(compliance.badge)}`}>
                          {compliance.badge === 'compliant' ? '✓' : compliance.badge === 'needs-review' ? '!' : '✗'} {compliance.badge}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-[#555]">{formatDate(job.createdAt)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
