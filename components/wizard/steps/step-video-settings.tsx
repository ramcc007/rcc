'use client'
import { useWizardStore } from '@/lib/store/wizard-store'
import { FilterToggleGroup } from '@/components/filters/filter-toggle-group'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'

const ASPECT_RATIO_OPTIONS = [
  { value: '9:16', label: '9:16 Vertical', description: 'TikTok, Reels, Shorts', emoji: '📱' },
  { value: '16:9', label: '16:9 Landscape', description: 'YouTube, Facebook', emoji: '🖥️' },
  { value: '1:1', label: '1:1 Square', description: 'Instagram feed', emoji: '⬛' },
]

const RESOLUTION_OPTIONS = [
  { value: '720p', label: '720p', description: 'Fast generation' },
  { value: '1080p', label: '1080p', description: 'Best quality' },
  { value: '4k', label: '4K', description: 'Ultra HD' },
]

const PERSONA_STYLE_OPTIONS = [
  { value: 'authentic', label: 'Authentic', description: 'Raw, casual, real' },
  { value: 'casual', label: 'Casual', description: 'Relaxed, everyday' },
  { value: 'professional', label: 'Professional', description: 'Clean, confident' },
]

const ETHNICITIES = [
  'diverse', 'White', 'Black', 'Hispanic/Latino', 'East Asian', 'South Asian', 'Middle Eastern', 'Mixed'
]

export function StepVideoSettings() {
  const { videoSettings, setVideoSettings, setStep } = useWizardStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const readers = acceptedFiles.slice(0, 5).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
    })
    Promise.all(readers).then(urls => {
      setVideoSettings({
        referenceImageUrls: [...videoSettings.referenceImageUrls, ...urls].slice(0, 5)
      })
    })
  }, [videoSettings.referenceImageUrls])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
  })

  const char = videoSettings.characterDesc

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Aspect ratio */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Video Format</h3>
        <FilterToggleGroup
          options={ASPECT_RATIO_OPTIONS}
          value={videoSettings.aspectRatio}
          onChange={(v) => setVideoSettings({ aspectRatio: v as never })}
          columns={3}
        />
      </div>

      {/* Resolution */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Resolution</h3>
        <FilterToggleGroup
          options={RESOLUTION_OPTIONS}
          value={videoSettings.resolution}
          onChange={(v) => setVideoSettings({ resolution: v as never })}
          columns={3}
        />
      </div>

      {/* Character builder */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Character / Avatar</h3>
        <div className="grid grid-cols-2 gap-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1.5">Age Range</label>
            <select
              value={char.ageRange}
              onChange={e => setVideoSettings({ characterDesc: { ...char, ageRange: e.target.value } })}
              className="w-full bg-[#262626] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              {['18-24', '25-34', '35-44', '45-54', '55+'].map(r => (
                <option key={r} value={r}>{r} years old</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1.5">Gender</label>
            <select
              value={char.gender}
              onChange={e => setVideoSettings({ characterDesc: { ...char, gender: e.target.value } })}
              className="w-full bg-[#262626] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              {['woman', 'man', 'person'].map(g => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1.5">Ethnicity</label>
            <select
              value={char.ethnicity}
              onChange={e => setVideoSettings({ characterDesc: { ...char, ethnicity: e.target.value } })}
              className="w-full bg-[#262626] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              {ETHNICITIES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1.5">Persona Style</label>
            <select
              value={char.persona}
              onChange={e => setVideoSettings({ characterDesc: { ...char, persona: e.target.value as never } })}
              className="w-full bg-[#262626] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              {PERSONA_STYLE_OPTIONS.map(p => (
                <option key={p.value} value={p.value}>{p.label} — {p.description}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reference images */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Product Reference Images</h3>
        <p className="text-xs text-[#555] mb-3">Upload product photos to guide the AI's visual style (max 5)</p>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-violet-500 bg-violet-500/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-6 h-6 text-[#555] mx-auto mb-2" />
          <p className="text-sm text-[#a3a3a3]">
            {isDragActive ? 'Drop images here...' : 'Drag product photos here or click to browse'}
          </p>
          <p className="text-xs text-[#555] mt-1">JPEG, PNG, WebP up to 10MB each</p>
        </div>

        {videoSettings.referenceImageUrls.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {videoSettings.referenceImageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt={`Reference ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-[#2a2a2a]" />
                <button
                  onClick={() => setVideoSettings({
                    referenceImageUrls: videoSettings.referenceImageUrls.filter((_, j) => j !== i)
                  })}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center hidden group-hover:flex"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclosure & Compliance */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Compliance & Disclosure</h3>
        <div className="space-y-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          {[
            {
              key: 'generateDisclosureOverlay' as const,
              label: 'Add Paid Partnership disclosure overlay',
              desc: 'Required by FTC & all major platforms for sponsored content',
              required: true,
            },
            {
              key: 'generateAILabel' as const,
              label: 'Add AI-generated content label',
              desc: 'Required by TikTok, Instagram, YouTube for AI content',
              required: true,
            },
          ].map(({ key, label, desc, required }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={videoSettings[key]}
                onChange={e => setVideoSettings({ [key]: e.target.checked })}
                className="mt-0.5 accent-violet-600"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-white">{label}</span>
                  {required && <span className="text-[10px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded font-medium">Required</span>}
                </div>
                <p className="text-xs text-[#555] mt-0.5">{desc}</p>
              </div>
            </label>
          ))}

          <div>
            <label className="block text-xs text-[#a3a3a3] mb-1.5">Disclosure Timing</label>
            <select
              value={videoSettings.disclosureTiming}
              onChange={e => setVideoSettings({ disclosureTiming: e.target.value as never })}
              className="bg-[#262626] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="beginning">Beginning (first 3 seconds) — Recommended</option>
              <option value="throughout">Throughout the video</option>
              <option value="end">End only (not FTC compliant alone)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Variant count */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Number of Variants</h3>
        <FilterToggleGroup
          options={[
            { value: '1', label: '1 variant', description: 'Fastest' },
            { value: '2', label: '2 variants', description: 'A/B test' },
            { value: '3', label: '3 variants', description: 'Best coverage' },
          ]}
          value={String(videoSettings.variantCount)}
          onChange={(v) => setVideoSettings({ variantCount: parseInt(v) as 1 | 2 | 3 })}
          columns={3}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-2.5 border border-[#2a2a2a] rounded-xl text-sm text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(5)}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          Review & Generate →
        </button>
      </div>
    </div>
  )
}
