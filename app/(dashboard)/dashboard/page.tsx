import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns, videoJobs, scripts } from '@/lib/db/schema'
import { eq, desc, count, and } from 'drizzle-orm'
import Link from 'next/link'
import { PlusCircle, Video, Megaphone, Clock, TrendingUp } from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const userCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(campaigns.createdAt))
    .limit(5)

  const [totalVideosRow, pendingReviewRow, approvedRow] = await Promise.all([
    db
      .select({ value: count() })
      .from(videoJobs)
      .innerJoin(scripts, eq(videoJobs.scriptId, scripts.id))
      .innerJoin(campaigns, eq(scripts.campaignId, campaigns.id))
      .where(eq(campaigns.userId, userId))
      .get(),
    db
      .select({ value: count() })
      .from(videoJobs)
      .innerJoin(scripts, eq(videoJobs.scriptId, scripts.id))
      .innerJoin(campaigns, eq(scripts.campaignId, campaigns.id))
      .where(and(eq(campaigns.userId, userId), eq(videoJobs.status, 'review')))
      .get(),
    db
      .select({ value: count() })
      .from(videoJobs)
      .innerJoin(scripts, eq(videoJobs.scriptId, scripts.id))
      .innerJoin(campaigns, eq(scripts.campaignId, campaigns.id))
      .where(and(eq(campaigns.userId, userId), eq(videoJobs.status, 'approved')))
      .get(),
  ])

  const totalCampaigns = userCampaigns.length
  const totalVideos = totalVideosRow?.value ?? 0
  const pendingReview = pendingReviewRow?.value ?? 0
  const approvedCount = approvedRow?.value ?? 0

  const stats = [
    { label: 'Campaigns', value: totalCampaigns, icon: Megaphone, color: 'text-blue-400' },
    { label: 'Videos Generated', value: totalVideos, icon: Video, color: 'text-violet-400' },
    { label: 'Pending Review', value: pendingReview, icon: Clock, color: 'text-yellow-400' },
    { label: 'Approved & Ready', value: approvedCount, icon: TrendingUp, color: 'text-green-400' },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-[#a3a3a3] mt-1">Create professional UGC videos powered by your Gemini account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-[#a3a3a3]">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick action */}
      <div className="bg-gradient-to-r from-violet-900/40 to-violet-600/10 border border-violet-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Ready to create?</h2>
        <p className="text-[#a3a3a3] text-sm mb-4 max-w-lg">
          Generate a professional UGC video script with AI, choose your character style, and produce a Veo 3 video — all in under 5 minutes.
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Video
        </Link>
      </div>

      {/* Recent campaigns */}
      {userCampaigns.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Recent Campaigns</h2>
            <Link href="/campaigns" className="text-xs text-violet-400 hover:text-violet-300">View all</Link>
          </div>
          <div className="space-y-2">
            {userCampaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 hover:border-[#3a3a3a] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">{campaign.name}</p>
                  <p className="text-xs text-[#a3a3a3]">{campaign.productName} · {campaign.productCategory}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(campaign.status ?? 'draft')}`}>
                    {campaign.status}
                  </span>
                  <span className="text-xs text-[#555]">{formatDate(campaign.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {userCampaigns.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#2a2a2a] rounded-2xl">
          <Video className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No videos yet</p>
          <p className="text-[#a3a3a3] text-sm mb-6">Create your first UGC video campaign to get started.</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Video
          </Link>
        </div>
      )}
    </div>
  )
}
