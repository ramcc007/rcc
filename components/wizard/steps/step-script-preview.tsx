'use client'
import { useEffect, useState } from 'react'
import { useWizardStore } from '@/lib/store/wizard-store'
import { useMutation } from '@tanstack/react-query'
import type { ScriptContent, SceneBreakdown } from '@/lib/types'
import { Sparkles, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react'

function ScriptSectionCard({
  label,
  content,
  color,
  onEdit,
}: {
  label: string
  content: string
  color: string
  onEdit: (val: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(content)

  return (
    <div className={`border rounded-xl p-4 bg-[#1a1a1a] border-l-2 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">{label}</span>
        <button
          onClick={() => {
            if (editing) onEdit(val)
            setEditing(!editing)
          }}
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>
      {editing ? (
        <textarea
          value={val}
          onChange={e => setVal(e.target.value)}
          className="w-full bg-[#262626] rounded-lg p-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-violet-500 min-h-[60px]"
          autoFocus
        />
      ) : (
        <p className="text-sm text-white leading-relaxed">{content}</p>
      )}
    </div>
  )
}

export function StepScriptPreview() {
  const {
    campaignId,
    scriptFilters,
    generatedScript,
    setGeneratedScript,
    setScriptId,
    setStep,
  } = useWizardStore()

  const [script, setScript] = useState<ScriptContent | null>(generatedScript)
  const [copied, setCopied] = useState(false)

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, filters: scriptFilters }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Script generation failed')
      }
      return res.json() as Promise<{ scriptId: string; content: ScriptContent }>
    },
    onSuccess: (data) => {
      setScript(data.content)
      setGeneratedScript(data.content)
      setScriptId(data.scriptId)
    },
  })

  useEffect(() => {
    if (!generatedScript) {
      generateMutation.mutate()
    }
  }, [])

  const handleCopy = () => {
    if (script?.fullText) {
      navigator.clipboard.writeText(script.fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (generateMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-violet-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">Writing your script...</p>
          <p className="text-[#a3a3a3] text-sm mt-1">Gemini 2.5 Pro is crafting your {scriptFilters.duration}s {scriptFilters.hookType} script</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (generateMutation.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 max-w-md">
        <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold">Script generation failed</p>
          <p className="text-[#a3a3a3] text-sm mt-1">{(generateMutation.error as Error).message}</p>
          {(generateMutation.error as Error).message.includes('API key') && (
            <a href="/settings" className="text-violet-400 text-sm underline mt-2 inline-block">
              Configure your Gemini API key →
            </a>
          )}
        </div>
        <button
          onClick={() => generateMutation.mutate()}
          className="flex items-center gap-2 bg-[#1e1e1e] border border-[#2a2a2a] hover:border-[#3a3a3a] text-white text-sm px-4 py-2 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    )
  }

  if (!script) return null

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Your Script</p>
          <p className="text-xs text-[#a3a3a3]">
            {scriptFilters.hookType} hook · {scriptFilters.funnelStage} · {scriptFilters.duration}s · {scriptFilters.platform}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs bg-[#1e1e1e] border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#a3a3a3] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => {
              setScript(null)
              generateMutation.mutate()
            }}
            className="flex items-center gap-1.5 text-xs bg-[#1e1e1e] border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#a3a3a3] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
        </div>
      </div>

      {/* Script sections */}
      <div className="space-y-3">
        <ScriptSectionCard
          label="🎣 Hook"
          content={script.hook}
          color="border-l-violet-500 border-[#2a2a2a]"
          onEdit={(v) => setScript(s => s ? { ...s, hook: v } : s)}
        />
        <ScriptSectionCard
          label="😤 Problem"
          content={script.problem}
          color="border-l-orange-500 border-[#2a2a2a]"
          onEdit={(v) => setScript(s => s ? { ...s, problem: v } : s)}
        />
        <ScriptSectionCard
          label="✨ Product"
          content={script.product}
          color="border-l-blue-500 border-[#2a2a2a]"
          onEdit={(v) => setScript(s => s ? { ...s, product: v } : s)}
        />
        <ScriptSectionCard
          label="📣 CTA"
          content={script.cta}
          color="border-l-green-500 border-[#2a2a2a]"
          onEdit={(v) => setScript(s => s ? { ...s, cta: v } : s)}
        />
      </div>

      {/* Scene breakdown */}
      {script.sceneBreakdown?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Scene Breakdown</h3>
          <div className="space-y-2">
            {script.sceneBreakdown.map((scene: SceneBreakdown) => (
              <div key={scene.sceneNumber} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full font-medium">
                    Scene {scene.sceneNumber}
                  </span>
                  <span className="text-xs text-[#555]">{scene.duration}s</span>
                </div>
                <p className="text-xs text-[#a3a3a3] mb-1.5">
                  <span className="text-[#555]">Visual:</span> {scene.visualDescription}
                </p>
                <p className="text-xs text-white">
                  <span className="text-[#555]">VO:</span> {scene.voiceover}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2.5 border border-[#2a2a2a] rounded-xl text-sm text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => {
            if (script) setGeneratedScript(script)
            setStep(4)
          }}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          Use This Script → Video Settings
        </button>
      </div>
    </div>
  )
}
