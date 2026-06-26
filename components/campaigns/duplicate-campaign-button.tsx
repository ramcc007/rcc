'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy } from 'lucide-react'

export function DuplicateCampaignButton({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDuplicate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/duplicate`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const { campaign } = await res.json()
      router.push(`/campaigns/${campaign.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-[#a3a3a3] hover:text-white hover:bg-[#262626] border border-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50"
    >
      <Copy className="w-3.5 h-3.5" />
      {loading ? 'Duplicating…' : 'Duplicate'}
    </button>
  )
}
