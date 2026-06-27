'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, Key, Video, Sparkles, Trash2 } from 'lucide-react'

function KeyField({
  label,
  description,
  badge,
  hasSaved,
  savedMask,
  placeholder,
  accentColor,
  onSave,
  isSaving,
  saveSuccess,
}: {
  label: string
  description: React.ReactNode
  badge?: React.ReactNode
  hasSaved: boolean
  savedMask: string | null
  placeholder: string
  accentColor: string
  onSave: (key: string) => void
  isSaving: boolean
  saveSuccess: boolean
}) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-3">
      {hasSaved && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span className="text-sm text-green-400">{label} configured</span>
          <span className="text-xs text-[#555] ml-auto">{savedMask}</span>
        </div>
      )}
      {badge}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={hasSaved ? 'Enter new key to replace...' : placeholder}
          className="w-full bg-[#262626] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-white text-sm pr-10 focus:outline-none focus:border-violet-500 placeholder:text-[#555]"
        />
        <button
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#a3a3a3]"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <button
        onClick={() => { onSave(value); setValue('') }}
        disabled={!value || isSaving}
        className={`px-4 py-2 text-sm ${accentColor} text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2`}
      >
        {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {saveSuccess ? 'Saved!' : `Save ${label}`}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const qc = useQueryClient()
  const [geminiKey, setGeminiKey] = useState('')
  const [showGemini, setShowGemini] = useState(false)
  const [testResult, setTestResult] = useState<boolean | null>(null)

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => fetch('/api/settings').then(r => r.json()),
  })

  const saveGeminiMutation = useMutation({
    mutationFn: (key: string) =>
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiApiKey: key }),
      }).then(r => r.json()),
    onSuccess: () => { setGeminiKey(''); qc.invalidateQueries({ queryKey: ['settings'] }) },
  })

  const saveFalMutation = useMutation({
    mutationFn: (key: string) =>
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ falApiKey: key }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  const testMutation = useMutation({
    mutationFn: (key: string) =>
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-api-key', apiKey: key }),
      }).then(r => r.json()),
    onSuccess: (data) => setTestResult(data.valid),
  })

  const deleteKeyMutation = useMutation({
    mutationFn: (keyType: 'gemini' | 'fal') =>
      fetch(`/api/settings?key=${keyType}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#a3a3a3] mt-1">Configure your API keys and preferences.</p>
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

      {/* fal.ai Key — primary video provider */}
      <section className="bg-[#1a1a1a] border border-violet-500/30 rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">fal.ai API Key</h2>
          </div>
          <span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-0.5 rounded-full font-medium">Recommended</span>
        </div>
        <p className="text-xs text-[#555] mb-4">
          Powers video generation via <strong className="text-[#a3a3a3]">Kling 1.6</strong> — works without a Google Cloud billing account.
          Sign up free at <span className="text-violet-400">fal.ai</span> → Dashboard → API Keys.
          You get <strong className="text-[#a3a3a3]">$10 free credits</strong> on signup (~100 videos).
        </p>

        {settings?.hasFalKey && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-sm text-green-400">fal.ai key configured</span>
            <span className="text-xs text-[#555] ml-auto mr-2">{settings.falKeyMasked}</span>
            <button
              onClick={() => deleteKeyMutation.mutate('fal')}
              disabled={deleteKeyMutation.isPending}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              title="Remove key"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        )}
        <KeyField
          label="fal.ai key"
          description={null}
          hasSaved={false}
          savedMask={null}
          placeholder="fal_key_..."
          accentColor="bg-violet-600 hover:bg-violet-700"
          onSave={(k) => saveFalMutation.mutate(k)}
          isSaving={saveFalMutation.isPending}
          saveSuccess={saveFalMutation.isSuccess}
        />
      </section>

      {/* Gemini API Key */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Key className="w-4 h-4 text-[#a3a3a3]" />
          <h2 className="text-sm font-semibold text-white">Gemini API Key</h2>
          <span className="text-xs text-[#555] ml-auto">For script generation</span>
        </div>
        <p className="text-xs text-[#555] mb-4">
          Required for AI script generation. Get your key from{' '}
          <span className="text-violet-400">aistudio.google.com</span>.
          Also used for Veo 3 video generation if you have access to it.
        </p>

        {settings?.hasGeminiKey && (
          <div className="flex items-center gap-2 mb-4 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-sm text-green-400">Gemini key configured</span>
            <span className="text-xs text-[#555] ml-auto mr-2">{settings.geminiKeyMasked}</span>
            <button
              onClick={() => deleteKeyMutation.mutate('gemini')}
              disabled={deleteKeyMutation.isPending}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              title="Remove key"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showGemini ? 'text' : 'password'}
              value={geminiKey}
              onChange={e => { setGeminiKey(e.target.value); setTestResult(null) }}
              placeholder={settings?.hasGeminiKey ? 'Enter new key to replace...' : 'AIza...'}
              className="w-full bg-[#262626] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-white text-sm pr-10 focus:outline-none focus:border-violet-500 placeholder:text-[#555]"
            />
            <button
              onClick={() => setShowGemini(!showGemini)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#a3a3a3]"
            >
              {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {testResult !== null && (
            <div className={`flex items-center gap-2 text-sm ${testResult ? 'text-green-400' : 'text-red-400'}`}>
              {testResult ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testResult ? 'API key is valid and working' : 'Invalid API key — check and try again'}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => testMutation.mutate(geminiKey)}
              disabled={!geminiKey || testMutation.isPending}
              className="px-4 py-2 text-sm border border-[#3a3a3a] hover:border-[#4a4a4a] text-[#a3a3a3] hover:text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {testMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Test Key
            </button>
            <button
              onClick={() => saveGeminiMutation.mutate(geminiKey)}
              disabled={!geminiKey || saveGeminiMutation.isPending}
              className="px-4 py-2 text-sm bg-[#262626] hover:bg-[#323232] border border-[#3a3a3a] text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saveGeminiMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saveGeminiMutation.isSuccess ? 'Saved!' : 'Save Gemini Key'}
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <p className="text-xs font-medium text-white">How video generation works</p>
        </div>
        <p className="text-xs text-[#555]">
          <strong className="text-[#a3a3a3]">fal.ai key set →</strong> Videos generated via Kling 1.6 on fal.ai. Works for everyone, no Google billing needed.
        </p>
        <p className="text-xs text-[#555]">
          <strong className="text-[#a3a3a3]">Only Gemini key →</strong> Uses Veo 3 via Google. Requires Veo API access on your Google account.
        </p>
        <p className="text-xs text-[#555]">
          <strong className="text-[#a3a3a3]">Scripts always use Gemini</strong> regardless of which video provider you pick.
        </p>
      </div>
    </div>
  )
}
