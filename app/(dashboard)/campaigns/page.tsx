import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import { PlusCircle, Megaphone, RefreshCw } from 'lucide-react'
import { formatDate, getStatusColor } from '@/lib/utils'
import { DeleteCampaignButton } from '@/components/campaigns/delete-campaign-button'

export default async function CampaignsPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const userCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(campaigns.createdAt))

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-[#a3a3a3] mt-1">{userCampaigns.length} campaign{userCampaigns.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {userCampaigns.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#2a2a2a] rounded-2xl">
          <Megaphone className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No campaigns yet</p>
          <p className="text-[#a3a3a3] text-sm mb-6">Start by creating your first UGC video campaign.</p>
          <Link href="/create" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            <PlusCircle className="w-4 h-4" />
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {userCampaigns.map(campaign => (
            <div
              key={campaign.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl px-5 py-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-violet-400" />
                </div>
                <Link href={`/campaigns/${campaign.id}`} className="flex-1 min-w-0 group">
                  <p className="text-white font-medium group-hover:text-violet-300 transition-colors truncate">{campaign.name}</p>
                  <p className="text-sm text-[#a3a3a3]">
                    {campaign.productName} · <span className="capitalize">{campaign.productCategory}</span>
                  </p>
                </Link>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(campaign.status ?? 'draft')}`}>
                    {campaign.status}
                  </span>
                  <span className="text-xs text-[#555] hidden sm:block">{formatDate(campaign.createdAt)}</span>
                  <Link
                    href={`/create?campaignId=${campaign.id}`}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-900/20 border border-violet-900/30 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Rebuild
                  </Link>
                  <DeleteCampaignButton campaignId={campaign.id} campaignName={campaign.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
