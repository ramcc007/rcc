'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface Props {
  campaignId: string
  campaignName: string
  redirectAfter?: boolean
}

export function DeleteCampaignButton({ campaignId, campaignName, redirectAfter }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch(`/api/campaigns/${campaignId}`, { method: 'DELETE' })
      if (redirectAfter) {
        router.push('/campaigns')
      } else {
        router.refresh()
      }
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#a3a3a3]">Delete &ldquo;{campaignName}&rdquo;?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {deleting ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] text-[#a3a3a3] rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-900/30 rounded-lg transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  )
}
