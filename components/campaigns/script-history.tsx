'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Script {
  id: string
  hookType: string
  funnelStage: string
  ctaType: string
  tone: string
  platform: string
  duration: number
  persona: string
  content: string
  version: number | null
  createdAt: Date | null
}

interface ScriptContent {
  hook?: string
  problem?: string
  product?: string
  cta?: string
  fullText?: string
}

export function ScriptHistory({ scripts }: { scripts: Script[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (scripts.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-white mb-3">Script History ({scripts.length})</h2>
      <div className="space-y-2">
        {scripts.map((script) => {
          let parsed: ScriptContent = {}
          try { parsed = JSON.parse(script.content) } catch { /* no-op */ }
          const isOpen = expanded === script.id

          return (
            <div key={script.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : script.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#222] transition-colors"
              >
                <FileText className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-0.5 rounded-full capitalize">{script.platform}</span>
                    <span className="text-xs bg-[#2a2a2a] text-[#a3a3a3] px-2 py-0.5 rounded-full capitalize">{script.hookType.replace('-', ' ')}</span>
                    <span className="text-xs bg-[#2a2a2a] text-[#a3a3a3] px-2 py-0.5 rounded-full capitalize">{script.tone}</span>
                    <span className="text-xs text-[#555]">{script.duration}s</span>
                  </div>
                </div>
                <span className="text-xs text-[#555] flex-shrink-0">{formatDate(script.createdAt)}</span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-[#555] flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#555] flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-3 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div><span className="text-[#555]">Funnel:</span> <span className="text-[#a3a3a3] ml-1 capitalize">{script.funnelStage}</span></div>
                    <div><span className="text-[#555]">CTA:</span> <span className="text-[#a3a3a3] ml-1 capitalize">{script.ctaType}</span></div>
                    <div><span className="text-[#555]">Persona:</span> <span className="text-[#a3a3a3] ml-1 capitalize">{script.persona}</span></div>
                    <div><span className="text-[#555]">Version:</span> <span className="text-[#a3a3a3] ml-1">{script.version ?? 1}</span></div>
                  </div>
                  {parsed.hook && (
                    <div>
                      <p className="text-xs font-medium text-violet-400 mb-1">Hook</p>
                      <p className="text-sm text-[#a3a3a3] leading-relaxed">{parsed.hook}</p>
                    </div>
                  )}
                  {parsed.problem && (
                    <div>
                      <p className="text-xs font-medium text-[#a3a3a3] mb-1">Problem</p>
                      <p className="text-sm text-[#a3a3a3] leading-relaxed">{parsed.problem}</p>
                    </div>
                  )}
                  {parsed.product && (
                    <div>
                      <p className="text-xs font-medium text-[#a3a3a3] mb-1">Product</p>
                      <p className="text-sm text-[#a3a3a3] leading-relaxed">{parsed.product}</p>
                    </div>
                  )}
                  {parsed.cta && (
                    <div>
                      <p className="text-xs font-medium text-[#a3a3a3] mb-1">CTA</p>
                      <p className="text-sm text-[#a3a3a3] leading-relaxed">{parsed.cta}</p>
                    </div>
                  )}
                  {!parsed.hook && parsed.fullText && (
                    <p className="text-sm text-[#a3a3a3] leading-relaxed whitespace-pre-wrap">{parsed.fullText}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
