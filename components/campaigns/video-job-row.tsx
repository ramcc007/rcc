'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight, Play, StickyNote, Check } from 'lucide-react'
import { getStatusColor, formatDate } from '@/lib/utils'

interface VideoJob {
  id: string
  aspectRatio: string
  resolution: string
  status: string
  outputUrl: string | null
  qualityScore: number | null
  complianceScore: number | null
  performanceNotes: string | null
  createdAt: Date | null
}

export function VideoJobRow({ job, scriptPlatform }: { job: VideoJob; scriptPlatform: string }) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(job.performanceNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveNotes() {
    setSaving(true)
    try {
      await fetch(`/api/videos/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performanceNotes: notes }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#222] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {job.outputUrl ? (
            <Play className="w-4 h-4 text-violet-400 flex-shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-[#444] flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm text-white">{job.aspectRatio} · {job.resolution}</p>
            <p className="text-xs text-[#555] capitalize">{scriptPlatform} · {formatDate(job.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {job.qualityScore != null && (
            <span className="text-xs text-[#a3a3a3] hidden sm:block">Q: {Math.round(job.qualityScore)}</span>
          )}
          {job.complianceScore != null && (
            <span className="text-xs text-[#a3a3a3] hidden sm:block">C: {Math.round(job.complianceScore)}</span>
          )}
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-[#555]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#555]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#2a2a2a] p-4 space-y-4">
          {/* Video player */}
          {job.outputUrl ? (
            <video
              src={job.outputUrl}
              controls
              className="w-full max-h-72 rounded-lg bg-black"
              style={{ maxWidth: job.aspectRatio === '9:16' ? '180px' : '100%' }}
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#555]">
              <div className="w-2 h-2 rounded-full bg-[#444] animate-pulse" />
              {job.status === 'failed' ? 'Video generation failed' : 'Video not yet available'}
            </div>
          )}

          {/* Performance notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-3.5 h-3.5 text-[#a3a3a3]" />
              <span className="text-xs font-medium text-[#a3a3a3]">Performance Notes</span>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this video's performance — e.g. CTR, views, comments, what worked..."
              rows={3}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={saveNotes}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {saved ? (
                  <><Check className="w-3.5 h-3.5" /> Saved</>
                ) : saving ? 'Saving…' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
