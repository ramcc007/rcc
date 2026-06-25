'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, Key } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [testResult, setTestResult] = useState<boolean | null>(null)

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => fetch('/api/settings').then(r => r.json()),
  })

  const saveMutation = useMutation({
    mutationFn: (key: string) =>
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiApiKey: key }),
      }).then(r => r.json()),
    onSuccess: () => setApiKey(''),
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

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#a3a3a3] mt-1">Configure your Gemini API key and preferences.</p>
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

      {/* Gemini API Key */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Key className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white">Gemini API Key</h2>
        </div>
        <p className="text-xs text-[#555] mb-4">
          Your API key is stored encrypted. Get your key from{' '}
          <span className="text-violet-400">Google AI Studio</span> (aistudio.google.com).
          Veo 3 video generation requires a paid Gemini Pro plan.
        </p>

        {settings?.hasGeminiKey && (
          <div className="flex items-center gap-2 mb-4 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">API key configured</span>
            <span className="text-xs text-[#555] ml-auto">{settings.geminiKeyMasked}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setTestResult(null) }}
              placeholder={settings?.hasGeminiKey ? 'Enter new key to replace...' : 'AIza...'}
              className="w-full bg-[#262626] border border-[#3a3a3a] rounded-xl px-4 py-2.5 text-white text-sm pr-10 focus:outline-none focus:border-violet-500 placeholder:text-[#555]"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#a3a3a3]"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              onClick={() => testMutation.mutate(apiKey)}
              disabled={!apiKey || testMutation.isPending}
              className="px-4 py-2 text-sm border border-[#3a3a3a] hover:border-[#4a4a4a] text-[#a3a3a3] hover:text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {testMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Test Key
            </button>
            <button
              onClick={() => saveMutation.mutate(apiKey)}
              disabled={!apiKey || saveMutation.isPending}
              className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saveMutation.isSuccess ? 'Saved!' : 'Save Key'}
            </button>
          </div>
        </div>
      </section>

      {/* Tip */}
      <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-xl p-4">
        <p className="text-xs text-yellow-400/80 font-medium mb-1">Veo 3 Access Required</p>
        <p className="text-xs text-[#555]">
          Video generation requires Veo 3 API access. Make sure your Google AI Studio project has Veo 3 enabled. Script generation works with any Gemini API key.
        </p>
      </div>
    </div>
  )
}
