'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'queued', label: 'Queued' },
  { value: 'generating', label: 'Generating' },
  { value: 'review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'failed', label: 'Failed' },
  { value: 'exported', label: 'Exported' },
]

const PLATFORM_OPTIONS = [
  { value: '', label: 'All Platforms' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
]

export function LibraryFilters({ total }: { total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get('status') ?? ''
  const platform = searchParams.get('platform') ?? ''
  const q = searchParams.get('q') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const hasFilters = status || platform || q

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
        <input
          type="text"
          defaultValue={q}
          placeholder="Search by product or campaign..."
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-violet-500 transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParam('q', (e.target as HTMLInputElement).value.trim())
            }
          }}
          onBlur={(e) => updateParam('q', e.target.value.trim())}
        />
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => updateParam('status', e.target.value)}
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Platform filter */}
      <select
        value={platform}
        onChange={(e) => updateParam('platform', e.target.value)}
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
      >
        {PLATFORM_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="flex items-center gap-1.5 text-xs text-[#a3a3a3] hover:text-white transition-colors px-2 py-2"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}

      <span className="text-xs text-[#555] ml-auto">{total} video{total !== 1 ? 's' : ''}</span>
    </div>
  )
}
