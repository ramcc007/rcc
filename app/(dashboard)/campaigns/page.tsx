import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import { PlusCircle, Megaphone } from 'lucide-react'
import { CampaignsClient } from '@/components/campaigns/campaigns-client'

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
        <CampaignsClient campaigns={userCampaigns} />
      )}
    </div>
  )
}
