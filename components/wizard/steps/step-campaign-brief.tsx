'use client'
import { useState } from 'react'
import { useWizardStore } from '@/lib/store/wizard-store'
import { useMutation } from '@tanstack/react-query'

const CATEGORIES = [
  { value: 'beauty', label: 'Beauty' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'tech', label: 'Tech' },
  { value: 'food', label: 'Food' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home' },
  { value: 'finance', label: 'Finance' },
  { value: 'saas', label: 'SaaS' },
]

export function StepCampaignBrief() {
  const { campaignData, setCampaignData, setCampaignId, setStep } = useWizardStore()

  const [form, setForm] = useState({
    name: campaignData.name ?? '',
    productName: campaignData.productName ?? '',
    productCategory: campaignData.productCategory ?? 'beauty',
    targetAudience: campaignData.targetAudience ?? '',
    brandVoice: campaignData.brandVoice ?? '',
    competitorNames: campaignData.competitorNames?.join(', ') ?? '',
  })

  const createCampaign = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          productName: form.productName,
          productCategory: form.productCategory,
          targetAudience: form.targetAudience,
          brandVoice: form.brandVoice || undefined,
          competitorNames: form.competitorNames
            ? form.competitorNames.split(',').map(s => s.trim()).filter(Boolean)
            : undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to create campaign')
      return res.json()
    },
    onSuccess: (data) => {
      setCampaignData({
        name: form.name,
        productName: form.productName,
        productCategory: form.productCategory as never,
        targetAudience: form.targetAudience,
        brandVoice: form.brandVoice || undefined,
      })
      setCampaignId(data.campaign.id)
      setStep(2)
    },
  })

  const isValid = form.name && form.productName && form.productCategory && form.targetAudience

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-white mb-1.5">Campaign Name <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Summer Skincare Launch Q3"
          className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Product Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.productName}
            onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
            placeholder="e.g. GlowSerum Pro"
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Category <span className="text-red-400">*</span></label>
          <select
            value={form.productCategory}
            onChange={e => setForm(f => ({ ...f, productCategory: e.target.value as import('@/lib/types').ProductCategory }))}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1.5">Target Audience <span className="text-red-400">*</span></label>
        <textarea
          value={form.targetAudience}
          onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
          placeholder="e.g. Women aged 25-40 who struggle with dry skin and want a quick morning routine"
          rows={3}
          className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-violet-500 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1.5">Brand Voice <span className="text-[#555] font-normal">(optional)</span></label>
        <textarea
          value={form.brandVoice}
          onChange={e => setForm(f => ({ ...f, brandVoice: e.target.value }))}
          placeholder="e.g. Friendly and relatable, never pushy. We speak like a knowledgeable friend, not a salesperson."
          rows={2}
          className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-violet-500 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1.5">Competitors to Outshine <span className="text-[#555] font-normal">(optional, comma-separated)</span></label>
        <input
          type="text"
          value={form.competitorNames}
          onChange={e => setForm(f => ({ ...f, competitorNames: e.target.value }))}
          placeholder="e.g. Brand A, Brand B, Brand C"
          className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {createCampaign.error && (
        <p className="text-sm text-red-400">{(createCampaign.error as Error).message}</p>
      )}

      <button
        onClick={() => createCampaign.mutate()}
        disabled={!isValid || createCampaign.isPending}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
      >
        {createCampaign.isPending ? 'Saving...' : 'Continue to Script Settings →'}
      </button>
    </div>
  )
}
