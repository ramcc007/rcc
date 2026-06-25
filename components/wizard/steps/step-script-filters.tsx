'use client'
import { useWizardStore } from '@/lib/store/wizard-store'
import { FilterToggleGroup } from '@/components/filters/filter-toggle-group'
import { Target, Megaphone, MessageSquare, Palette, Smartphone, Clock, Users } from 'lucide-react'

const HOOK_OPTIONS = [
  { value: 'problem-led', label: 'Problem-Led', description: 'Opens with viewer pain', emoji: '😤' },
  { value: 'result-led', label: 'Result-Led', description: 'Transformation first', emoji: '✨' },
  { value: 'question-based', label: 'Question', description: 'Stops the scroll', emoji: '🤔' },
  { value: 'controversial', label: 'Controversial', description: 'Bold opinion', emoji: '🔥' },
  { value: 'visual-disruption', label: 'Visual Shock', description: 'Unexpected visual', emoji: '👀' },
]

const FUNNEL_OPTIONS = [
  { value: 'awareness', label: 'Awareness', description: 'Cold audience', emoji: '🌱' },
  { value: 'consideration', label: 'Consideration', description: 'Building desire', emoji: '🤍' },
  { value: 'conversion', label: 'Conversion', description: 'Close the sale', emoji: '💳' },
  { value: 'retention', label: 'Retention', description: 'Loyal customers', emoji: '♻️' },
]

const CTA_OPTIONS = [
  { value: 'soft', label: 'Soft CTA', description: '"Check link in bio"', emoji: '🔗' },
  { value: 'friction', label: 'Friction CTA', description: '"Comment below"', emoji: '💬' },
  { value: 'urgency', label: 'Urgency CTA', description: '"This week only"', emoji: '⏰' },
  { value: 'loyalty', label: 'Loyalty CTA', description: '"Join us"', emoji: '🤝' },
]

const TONE_OPTIONS = [
  { value: 'authentic', label: 'Authentic', description: 'Raw & real', emoji: '🎥' },
  { value: 'polished', label: 'Polished', description: 'Clean & refined', emoji: '💎' },
  { value: 'humorous', label: 'Humorous', description: 'Fun & relatable', emoji: '😂' },
  { value: 'expert', label: 'Expert', description: 'Credible & data-backed', emoji: '🎓' },
  { value: 'peer-recommended', label: 'Peer Rec.', description: 'Friend telling friend', emoji: '👯' },
]

const PLATFORM_OPTIONS = [
  { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { value: 'instagram', label: 'Instagram', emoji: '📸' },
  { value: 'youtube', label: 'YouTube Shorts', emoji: '▶️' },
  { value: 'facebook', label: 'Facebook', emoji: '📘' },
]

const DURATION_OPTIONS = [
  { value: '15', label: '15 sec', description: '~30-45 words' },
  { value: '30', label: '30 sec', description: '~60-80 words' },
  { value: '60', label: '60 sec', description: '~120-150 words' },
  { value: '90', label: '90 sec', description: '~180-220 words' },
]

const PERSONA_OPTIONS = [
  { value: 'mom', label: 'Mom/Parent', emoji: '👩‍👧' },
  { value: 'genz', label: 'Gen Z', emoji: '✌️' },
  { value: 'lifestyle', label: 'Lifestyle', emoji: '🌿' },
  { value: 'expert', label: 'Expert', emoji: '🔬' },
  { value: 'everyday', label: 'Everyday', emoji: '🙋' },
]

interface FilterSectionProps {
  title: string
  badge?: string
  children: React.ReactNode
}

function FilterSection({ title, badge, children }: FilterSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {badge && (
          <span className="text-[10px] bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export function StepScriptFilters() {
  const { scriptFilters, setScriptFilters, setStep } = useWizardStore()

  return (
    <div className="space-y-6 max-w-2xl">
      <FilterSection title="Hook Type" badge="60-80% of performance">
        <FilterToggleGroup
          options={HOOK_OPTIONS}
          value={scriptFilters.hookType}
          onChange={(v) => setScriptFilters({ hookType: v as never })}
          columns={5}
        />
      </FilterSection>

      <FilterSection title="Funnel Stage">
        <FilterToggleGroup
          options={FUNNEL_OPTIONS}
          value={scriptFilters.funnelStage}
          onChange={(v) => setScriptFilters({ funnelStage: v as never })}
          columns={4}
        />
      </FilterSection>

      <div className="grid grid-cols-2 gap-6">
        <FilterSection title="CTA Style" badge="20-40% of performance">
          <FilterToggleGroup
            options={CTA_OPTIONS}
            value={scriptFilters.ctaType}
            onChange={(v) => setScriptFilters({ ctaType: v as never })}
            columns={2}
          />
        </FilterSection>

        <FilterSection title="Tone & Voice">
          <div className="grid grid-cols-2 gap-2">
            {TONE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setScriptFilters({ tone: opt.value as never })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                  scriptFilters.tone === opt.value
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-[#1e1e1e] border-[#2a2a2a] text-[#a3a3a3] hover:border-[#3a3a3a] hover:text-white'
                }`}
              >
                <span>{opt.emoji}</span>
                <div>
                  <div>{opt.label}</div>
                  <div className="text-[10px] text-[#555] font-normal">{opt.description}</div>
                </div>
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <FilterSection title="Target Platform">
          <FilterToggleGroup
            options={PLATFORM_OPTIONS}
            value={scriptFilters.platform}
            onChange={(v) => setScriptFilters({ platform: v as never })}
            columns={2}
          />
        </FilterSection>

        <FilterSection title="Video Duration">
          <FilterToggleGroup
            options={DURATION_OPTIONS}
            value={String(scriptFilters.duration)}
            onChange={(v) => setScriptFilters({ duration: parseInt(v) })}
            columns={2}
          />
        </FilterSection>
      </div>

      <FilterSection title="Creator Persona">
        <FilterToggleGroup
          options={PERSONA_OPTIONS}
          value={scriptFilters.persona}
          onChange={(v) => setScriptFilters({ persona: v as never })}
          columns={5}
        />
      </FilterSection>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2.5 border border-[#2a2a2a] rounded-xl text-sm text-[#a3a3a3] hover:text-white hover:border-[#3a3a3a] transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          Generate Script →
        </button>
      </div>
    </div>
  )
}
