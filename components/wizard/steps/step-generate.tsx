'use client'
import { useState, useEffect, useRef } from 'react'
import { useWizardStore } from '@/lib/store/wizard-store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ComplianceBadge } from '@/components/compliance/compliance-badge'
import { ComplianceChecklist } from '@/components/compliance/compliance-checklist'
import { QualityScoreCard } from '@/components/quality/quality-score-card'
import { VideoPlayer } from '@/components/player/video-player'
import { Sparkles, CheckCircle, AlertCircle, RotateCcw, Download } from 'lucide-react'
import type { ComplianceReport, QualityReport } from '@/lib/types'
import Link from 'next/link'

const STATUS_MESSAGES = [
  'Initializing Veo 3...',
  'Analyzing your script...',
  'Building character description...',
  'Generating video scenes...',
  'Processing native audio...',
  'Applying cinematic style...',
  'Finalizing your UGC video...',
]

function GeneratingSummary() {
  const { campaignData, scriptFilters, videoSettings, generatedScript } = useWizardStore()
  return (
    <div className="space-y-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-sm">
      <div className="grid grid-cols-2 gap-y-2 gap-x-6">
        <div><span className="text-[#555]">Product:</span> <span className="text-white">{campaignData.productName}</span></div>
        <div><span className="text-[#555]">Platform:</span> <span className="text-white capitalize">{scriptFilters.platform}</span></div>
        <div><span className="text-[#555]">Hook:</span> <span className="text-white capitalize">{scriptFilters.hookType}</span></div>
        <div><span className="text-[#555]">Duration:</span> <span className="text-white">{scriptFilters.duration}s</span></div>
        <div><span className="text-[#555]">Format:</span> <span className="text-white">{videoSettings.aspectRatio}</span></div>
        <div><span className="text-[#555]">Resolution:</span> <span className="text-white">{videoSettings.resolution}</span></div>
        <div><span className="text-[#555]">Character:</span> <span className="text-white">{videoSettings.characterDesc.ageRange} {videoSettings.characterDesc.gender}</span></div>
        <div><span className="text-[#555]">Style:</span> <span className="text-white capitalize">{videoSettings.characterDesc.persona}</span></div>
      </div>
    </div>
  )
}

export function StepGenerate() {
  const {
    scriptId,
    videoSettings,
    scriptFilters,
    activeJobId,
    setActiveJobId,
    setStep,
    reset,
  } = useWizardStore()

  const [phase, setPhase] = useState<'summary' | 'generating' | 'review' | 'done'>('summary')
  const [fakeProgress, setFakeProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptId,
          aspectRatio: videoSettings.aspectRatio,
          resolution: videoSettings.resolution,
          characterDesc: videoSettings.characterDesc,
          referenceImageUrls: videoSettings.referenceImageUrls,
          generateDisclosureOverlay: videoSettings.generateDisclosureOverlay,
          generateAILabel: videoSettings.generateAILabel,
          disclosureTiming: videoSettings.disclosureTiming,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Video generation failed')
      }
      return res.json() as Promise<{ jobId: string }>
    },
    onSuccess: ({ jobId }) => {
      setActiveJobId(jobId)
      setPhase('generating')
      startProgress()
    },
  })

  const startProgress = () => {
    setFakeProgress(0)
    progressInterval.current = setInterval(() => {
      setFakeProgress(p => {
        if (p >= 90) {
          if (progressInterval.current) clearInterval(progressInterval.current)
          return 90
        }
        return p + Math.random() * 3
      })
      setMsgIndex(i => (i + 1) % STATUS_MESSAGES.length)
    }, 2500)
  }

  // Poll job status
  const { data: jobData } = useQuery({
    queryKey: ['job-status', activeJobId],
    queryFn: async () => {
      const res = await fetch(`/api/videos/status/${activeJobId}`)
      if (!res.ok) throw new Error('Failed to fetch job status')
      return res.json() as Promise<{ job: { status: string; outputUrl?: string; qualityReport?: QualityReport; complianceReport?: ComplianceReport; errorMessage?: string } }>
    },
    enabled: !!activeJobId && phase === 'generating',
    refetchInterval: 5000,
  })

  useEffect(() => {
    const job = jobData?.job
    if (!job) return

    if (job.status === 'review' || job.status === 'approved') {
      if (progressInterval.current) clearInterval(progressInterval.current)
      setFakeProgress(100)
      setTimeout(() => setPhase('review'), 500)
    } else if (job.status === 'failed') {
      if (progressInterval.current) clearInterval(progressInterval.current)
      setPhase('summary')
    }
  }, [jobData])

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/videos/${activeJobId}/approve`, { method: 'POST' })
      if (!res.ok) throw new Error('Approval failed')
      return res.json()
    },
    onSuccess: () => setPhase('done'),
  })

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/videos/${activeJobId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'mp4', resolution: videoSettings.resolution }),
      })
      if (!res.ok) throw new Error('Export failed')
      return res.json() as Promise<{ downloadUrl: string; filename: string }>
    },
    onSuccess: ({ downloadUrl, filename }) => {
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      a.click()
    },
  })

  const job = jobData?.job

  if (phase === 'summary') {
    return (
      <div className="space-y-6 max-w-xl">
        <div>
          <h3 className="text-white font-semibold mb-1">Ready to Generate</h3>
          <p className="text-[#a3a3a3] text-sm">Review your settings, then click generate. Veo 3 typically takes 30–90 seconds.</p>
        </div>
        <GeneratingSummary />

        {generateMutation.isError && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-400">{(generateMutation.error as Error).message}</p>
              {(generateMutation.error as Error).message.includes('API key') && (
                <a href="/settings" className="text-xs text-red-300 underline">Configure Gemini API key →</a>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => setStep(4)} className="px-6 py-2.5 border border-[#2a2a2a] rounded-xl text-sm text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] transition-colors">
            ← Back
          </button>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            {generateMutation.isPending ? 'Starting...' : 'Generate with Veo 3'}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-violet-600/20 rounded-2xl flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-violet-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg mb-1">Generating your video...</p>
          <p className="text-[#a3a3a3] text-sm">{STATUS_MESSAGES[msgIndex]}</p>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-1000"
            style={{ width: `${fakeProgress}%` }}
          />
        </div>
        <p className="text-xs text-[#555]">Veo 3 typically takes 30–90 seconds</p>

        {job?.status === 'failed' && (
          <div className="text-red-400 text-sm">{job.errorMessage ?? 'Generation failed'}</div>
        )}
      </div>
    )
  }

  if (phase === 'review' && job) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Review Your Video</p>
            <p className="text-[#a3a3a3] text-sm">Approve to save to your library, or regenerate</p>
          </div>
          <div className="flex items-center gap-2">
            {job.complianceReport && <ComplianceBadge badge={(job.complianceReport as ComplianceReport).badge} />}
          </div>
        </div>

        {job.outputUrl && (
          <VideoPlayer src={job.outputUrl} aspectRatio={videoSettings.aspectRatio} />
        )}

        <div className="grid grid-cols-2 gap-4">
          {job.qualityReport && <QualityScoreCard report={job.qualityReport as QualityReport} />}
          {job.complianceReport && (
            <ComplianceChecklist report={job.complianceReport as ComplianceReport} compact />
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setActiveJobId(null)
              setPhase('summary')
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#2a2a2a] rounded-xl text-sm text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#2a2a2a] rounded-xl text-sm text-white hover:border-violet-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {approveMutation.isPending ? 'Approving...' : 'Approve & Save'}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">Video Approved!</p>
          <p className="text-[#a3a3a3] text-sm mt-1">Your video has been saved to your library.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/library" className="px-5 py-2.5 border border-[#2a2a2a] rounded-xl text-sm text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] transition-colors">
            View Library
          </Link>
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    )
  }

  return null
}
