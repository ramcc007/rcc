'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Megaphone, RefreshCw, Trash2, Archive, CheckSquare, Square, Copy
} from 'lucide-react'
import { getStatusColor, formatDate } from '@/lib/utils'

interface Campaign {
  id: string
  name: string
  productName: string
  productCategory: string
  status: string
  createdAt: Date | null
}

export function CampaignsClient({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [bulkConfirm, setBulkConfirm] = useState<'delete' | 'archive' | null>(null)

  const allSelected = campaigns.length > 0 && selected.size === campaigns.length
  const someSelected = selected.size > 0

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(campaigns.map(c => c.id)))
  }

  async function bulkDelete() {
    await Promise.all([...selected].map(id =>
      fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
    ))
    setSelected(new Set())
    setBulkConfirm(null)
    startTransition(() => router.refresh())
  }

  async function bulkArchive() {
    await Promise.all([...selected].map(id =>
      fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      })
    ))
    setSelected(new Set())
    setBulkConfirm(null)
    startTransition(() => router.refresh())
  }

  async function duplicateCampaign(campaignId: string) {
    const res = await fetch(`/api/campaigns/${campaignId}/duplicate`, { method: 'POST' })
    if (!res.ok) return
    const { campaign } = await res.json()
    router.push(`/campaigns/${campaign.id}`)
  }

  async function deleteCampaign(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
    startTransition(() => router.refresh())
  }

  return (
    <>
      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 bg-violet-900/20 border border-violet-700/30 rounded-xl px-4 py-2.5 mb-4">
          <span className="text-sm text-violet-300">{selected.size} selected</span>
          <div className="flex-1" />
          {bulkConfirm === 'delete' ? (
            <>
              <span className="text-xs text-red-400">Delete {selected.size} campaign{selected.size > 1 ? 's' : ''}?</span>
              <button onClick={bulkDelete} disabled={isPending} className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
                Yes, delete all
              </button>
              <button onClick={() => setBulkConfirm(null)} className="text-xs px-3 py-1.5 bg-[#2a2a2a] text-[#a3a3a3] rounded-lg hover:bg-[#333] transition-colors">
                Cancel
              </button>
            </>
          ) : bulkConfirm === 'archive' ? (
            <>
              <span className="text-xs text-yellow-400">Archive {selected.size} campaign{selected.size > 1 ? 's' : ''}?</span>
              <button onClick={bulkArchive} disabled={isPending} className="text-xs px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50">
                Yes, archive all
              </button>
              <button onClick={() => setBulkConfirm(null)} className="text-xs px-3 py-1.5 bg-[#2a2a2a] text-[#a3a3a3] rounded-lg hover:bg-[#333] transition-colors">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setBulkConfirm('archive')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 border border-yellow-900/30 rounded-lg transition-colors"
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
              <button
                onClick={() => setBulkConfirm('delete')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Select all row */}
      <div className="flex items-center gap-3 px-1 mb-2">
        <button onClick={toggleAll} className="flex items-center gap-2 text-xs text-[#555] hover:text-[#a3a3a3] transition-colors">
          {allSelected ? <CheckSquare className="w-4 h-4 text-violet-400" /> : <Square className="w-4 h-4" />}
          Select all
        </button>
      </div>

      {/* Campaign rows */}
      <div className="space-y-2">
        {campaigns.map(campaign => (
          <div
            key={campaign.id}
            className={`bg-[#1a1a1a] border rounded-xl px-4 py-4 transition-colors ${
              selected.has(campaign.id) ? 'border-violet-600/50 bg-violet-900/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
            }`}
          >
            <div className="flex items-center gap-3">
              <button onClick={() => toggleOne(campaign.id)} className="flex-shrink-0">
                {selected.has(campaign.id)
                  ? <CheckSquare className="w-4 h-4 text-violet-400" />
                  : <Square className="w-4 h-4 text-[#444] hover:text-[#666]" />
                }
              </button>
              <div className="w-9 h-9 bg-violet-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-4 h-4 text-violet-400" />
              </div>
              <Link href={`/campaigns/${campaign.id}`} className="flex-1 min-w-0 group">
                <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors truncate">{campaign.name}</p>
                <p className="text-xs text-[#a3a3a3]">
                  {campaign.productName} · <span className="capitalize">{campaign.productCategory}</span>
                </p>
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(campaign.status ?? 'draft')}`}>
                  {campaign.status}
                </span>
                <span className="text-xs text-[#555] hidden md:block">{formatDate(campaign.createdAt)}</span>
                <button
                  onClick={() => duplicateCampaign(campaign.id)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-[#a3a3a3] hover:text-white hover:bg-[#262626] border border-[#2a2a2a] rounded-lg transition-colors"
                  title="Duplicate campaign"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <Link
                  href={`/create?campaignId=${campaign.id}`}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-900/20 border border-violet-900/30 rounded-lg transition-colors"
                  title="Rebuild video"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => deleteCampaign(campaign.id, campaign.name)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-900/30 rounded-lg transition-colors"
                  title="Delete campaign"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
