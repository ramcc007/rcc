'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, Key, Video, Zap, Trash2, AlertTriangle, Copy, Check, ClipboardCopy } from 'lucide-react'

function KeySection({
  title,
  icon,
  badge,
  description,
  placeholder,
  accentClass,
  hasSaved,
  savedMask,
  isSaving,
  saveSuccess,
  isTesting,
  testResult,
  onSave,
  onTest,
  onRemove,
  isRemoving,
}: {
  title: string
  icon: React.ReactNode
  badge?: React.ReactNode
  description: React.ReactNode
  placeholder: string
  accentClass: string
  hasSaved: boolean
  savedMask: string | null
  isSaving: boolean
  saveSuccess: boolean
  isTesting?: boolean
  testResult?: boolean | null
  onSave: (key: string) => void
  onTest?: (key: string) => void
  onRemove?: () => void
  isRemoving?: boolean
}) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-3">
      {hasSaved && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span className="text-sm text-green-400">{title} configured</span>
          <span className="text-xs text-[#555] ml-auto mr-2">{savedMask}</span>
          {onRemove && (
            <button
              onClick={onRemove}
              disabled={isRemoving}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          )}
        </div>
      )}

      {badge}
      <p className="text-xs text-[#555]">{description}</p>

      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={hasSaved ? 'Enter new key to replace...' : placeholder}
          className="w-full bg-[#262626] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-white text-sm pr-10 focus:outline-none focus:border-violet-500 placeholder:text-[#555]"
        />
        <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#a3a3a3]">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {testResult !== null && testResult !== undefined && (
        <div className={`flex items-center gap-2 text-sm ${testResult ? 'text-green-400' : 'text-red-400'}`}>
          {testResult ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {testResult ? 'Key is valid and working' : 'Key is invalid or has no quota'}
        </div>
      )}

      <div className="flex gap-3">
        {onTest && (
          <button
            onClick={() => onTest(value)}
            disabled={!value || isTesting}
            className="px-4 py-2 text-sm border border-[#3a3a3a] hover:border-[#4a4a4a] text-[#a3a3a3] hover:text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isTesting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Test Key
          </button>
        )}
        <button
          onClick={() => { onSave(value); setValue('') }}
          disabled={!value || isSaving}
          className={`px-4 py-2 text-sm ${accentClass} text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2`}
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saveSuccess ? 'Saved!' : `Save ${title}`}
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const qc = useQueryClient()
  const [groqTestResult, setGroqTestResult] = useState<boolean | null>(null)
  const [geminiTestResult, setGeminiTestResult] = useState<boolean | null>(null)

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => fetch('/api/settings').then(r => r.json()),
  })

  const saveGroqMutation = useMutation({
    mutationFn: (key: string) => fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ groqApiKey: key }) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  const saveGeminiMutation = useMutation({
    mutationFn: (key: string) => fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ geminiApiKey: key }) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  const saveFalMutation = useMutation({
    mutationFn: (key: string) => fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ falApiKey: key }) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  const testGroqMutation = useMutation({
    mutationFn: (key: string) => fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'test-groq-key', apiKey: key }) }).then(r => r.json()),
    onSuccess: (data) => setGroqTestResult(data.valid),
  })

  const testGeminiMutation = useMutation({
    mutationFn: (key: string) => fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'test-api-key', apiKey: key }) }).then(r => r.json()),
    onSuccess: (data) => setGeminiTestResult(data.valid),
  })

  const deleteKeyMutation = useMutation({
    mutationFn: (keyType: 'gemini' | 'fal' | 'groq') => fetch(`/api/settings?key=${keyType}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#a3a3a3] mt-1">Configure your API keys.</p>
      </div>

      {/* Account */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-5">
        <h2 className="text-sm font-semibold text-white mb-4">Account</h2>
        <div className="flex items-center gap-3">
          {session?.user?.image && (
            <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-full" />
          )}
          <div>
            <p className="text-sm font-medium text-white">{session?.user?.name}</p>
            <p className="text-xs text-[#a3a3a3]">{session?.user?.email}</p>
          </div>
        </div>
      </section>

      {/* Groq — primary script AI */}
      <section className="bg-[#1a1a1a] border border-violet-500/40 rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Groq API Key</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-0.5 rounded-full font-medium">Script AI</span>
            <span className="text-xs bg-green-600/20 text-green-300 px-2 py-0.5 rounded-full font-medium">Free</span>
          </div>
        </div>
        <KeySection
          title="Groq key"
          icon={<Zap className="w-4 h-4" />}
          description={
            <>
              Powers script generation via <strong className="text-[#a3a3a3]">Llama 3.3 70B</strong>.
              Completely free — no credit card required.{' '}
              Sign up at <strong className="text-violet-400">console.groq.com</strong> → API Keys → Create key.
              Takes 30 seconds.
            </>
          }
          placeholder="gsk_..."
          accentClass="bg-violet-600 hover:bg-violet-700"
          hasSaved={!!settings?.hasGroqKey}
          savedMask={settings?.groqKeyMasked}
          isSaving={saveGroqMutation.isPending}
          saveSuccess={saveGroqMutation.isSuccess}
          isTesting={testGroqMutation.isPending}
          testResult={groqTestResult}
          onSave={(k) => saveGroqMutation.mutate(k)}
          onTest={(k) => { setGroqTestResult(null); testGroqMutation.mutate(k) }}
          onRemove={() => deleteKeyMutation.mutate('groq')}
          isRemoving={deleteKeyMutation.isPending}
        />
      </section>

      {/* fal.ai — video */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#a3a3a3]" />
            <h2 className="text-sm font-semibold text-white">fal.ai API Key</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#262626] text-[#a3a3a3] px-2 py-0.5 rounded-full">Video generation</span>
            <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">$10 free credits</span>
          </div>
        </div>
        <KeySection
          title="fal.ai key"
          icon={<Video className="w-4 h-4" />}
          description={
            <>
              Powers video generation via <strong className="text-[#a3a3a3]">Kling 1.6</strong>.
              Sign up at <strong className="text-[#a3a3a3]">fal.ai</strong> → Dashboard → API Keys.
              You get <strong className="text-[#a3a3a3]">$10 free credits</strong> (~100 videos).
            </>
          }
          placeholder="fal_key_..."
          accentClass="bg-[#262626] hover:bg-[#323232] border border-[#3a3a3a]"
          hasSaved={!!settings?.hasFalKey}
          savedMask={settings?.falKeyMasked}
          isSaving={saveFalMutation.isPending}
          saveSuccess={saveFalMutation.isSuccess}
          onSave={(k) => saveFalMutation.mutate(k)}
          onRemove={() => deleteKeyMutation.mutate('fal')}
          isRemoving={deleteKeyMutation.isPending}
        />
      </section>

      {/* Gemini — optional legacy */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#555]" />
            <h2 className="text-sm font-semibold text-[#a3a3a3]">Gemini API Key</h2>
          </div>
          <span className="text-xs text-[#555]">Optional — fallback only</span>
        </div>
        <KeySection
          title="Gemini key"
          icon={<Key className="w-4 h-4" />}
          description="Used as fallback for scripts if no Groq key is set. Requires a key from aistudio.google.com on a project with no billing enabled."
          placeholder="AIza..."
          accentClass="bg-[#262626] hover:bg-[#323232] border border-[#3a3a3a]"
          hasSaved={!!settings?.hasGeminiKey}
          savedMask={settings?.geminiKeyMasked}
          isSaving={saveGeminiMutation.isPending}
          saveSuccess={saveGeminiMutation.isSuccess}
          isTesting={testGeminiMutation.isPending}
          testResult={geminiTestResult}
          onSave={(k) => saveGeminiMutation.mutate(k)}
          onTest={(k) => { setGeminiTestResult(null); testGeminiMutation.mutate(k) }}
          onRemove={() => deleteKeyMutation.mutate('gemini')}
          isRemoving={deleteKeyMutation.isPending}
        />
      </section>

      {/* Error Log */}
      <ErrorLog />
    </div>
  )
}

function ErrorLog() {
  const [copied, setCopied] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['debug-errors'],
    queryFn: () => fetch('/api/debug/errors').then(r => r.json()),
  })

  const clearMutation = useMutation({
    mutationFn: () => fetch('/api/debug/errors', { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['debug-errors'] }),
  })

  const errors: Array<{ id: number; route: string; errorMessage: string; errorDetail: string | null; createdAt: number }> = data?.errors ?? []

  function copyAll() {
    const text = errors.map(e =>
      `[${new Date((e.createdAt ?? 0) * 1000).toISOString()}] ${e.route}\n${e.errorDetail ?? e.errorMessage}`
    ).join('\n\n---\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mt-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <h2 className="text-sm font-semibold text-white">Error Log</h2>
          {errors.length > 0 && (
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{errors.length}</span>
          )}
        </div>
        {errors.length > 0 && (
          <div className="flex gap-3">
            <button onClick={copyAll} className="flex items-center gap-1 text-xs text-[#a3a3a3] hover:text-white transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy all'}
            </button>
            <button onClick={() => clearMutation.mutate()} disabled={clearMutation.isPending} className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
              Clear
            </button>
          </div>
        )}
      </div>

      {isLoading && <p className="text-xs text-[#555]">Loading...</p>}

      {!isLoading && errors.length === 0 && (
        <p className="text-xs text-[#555]">No errors. Failures from script and video generation appear here.</p>
      )}

      {errors.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {errors.map(e => (
            <div key={e.id} className="bg-[#111] border border-[#2a2a2a] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#555]">{new Date((e.createdAt ?? 0) * 1000).toLocaleString()}</span>
                <span className="text-xs text-violet-400">{e.route}</span>
              </div>
              <p className="text-xs text-red-300 leading-relaxed font-mono break-all">{e.errorDetail ?? e.errorMessage}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
