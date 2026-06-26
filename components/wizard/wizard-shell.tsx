'use client'
import { useEffect, useRef } from 'react'
import { useWizardStore } from '@/lib/store/wizard-store'
import { StepCampaignBrief } from './steps/step-campaign-brief'
import { StepScriptFilters } from './steps/step-script-filters'
import { StepScriptPreview } from './steps/step-script-preview'
import { StepVideoSettings } from './steps/step-video-settings'
import { StepGenerate } from './steps/step-generate'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { number: 1, label: 'Campaign Brief' },
  { number: 2, label: 'Script Filters' },
  { number: 3, label: 'Script Preview' },
  { number: 4, label: 'Video Settings' },
  { number: 5, label: 'Generate & Review' },
]

interface WizardShellProps {
  preloadCampaignId?: string
}

export function WizardShell({ preloadCampaignId }: WizardShellProps) {
  const { currentStep, preloadCampaign, reset } = useWizardStore()
  const preloaded = useRef(false)

  useEffect(() => {
    if (!preloadCampaignId || preloaded.current) return
    preloaded.current = true
    reset()
    fetch(`/api/campaigns/${preloadCampaignId}`)
      .then(r => r.json())
      .then(({ campaign }) => {
        if (!campaign) return
        preloadCampaign(campaign.id, {
          name: campaign.name,
          productName: campaign.productName,
          productCategory: campaign.productCategory,
          targetAudience: campaign.targetAudience ?? '',
          brandVoice: campaign.brandVoice ?? '',
          competitorNames: campaign.competitorNames ?? [],
        })
      })
      .catch(() => {/* silently fall back to step 1 */})
  }, [preloadCampaignId, preloadCampaign, reset])

  return (
    <div className="max-w-3xl">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number
          const isActive = currentStep === step.number
          return (
            <div key={step.number} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  isCompleted ? 'bg-violet-600 text-white' :
                  isActive ? 'bg-violet-600 text-white ring-4 ring-violet-600/20' :
                  'bg-[#2a2a2a] text-[#555]'
                )}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.number}
                </div>
                <span className={cn(
                  'text-[11px] font-medium whitespace-nowrap',
                  isActive ? 'text-white' : isCompleted ? 'text-violet-400' : 'text-[#555]'
                )}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={cn(
                  'h-px w-12 mx-2 mb-5 transition-colors',
                  currentStep > step.number ? 'bg-violet-600' : 'bg-[#2a2a2a]'
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div>
        {currentStep === 1 && <StepCampaignBrief />}
        {currentStep === 2 && <StepScriptFilters />}
        {currentStep === 3 && <StepScriptPreview />}
        {currentStep === 4 && <StepVideoSettings />}
        {currentStep === 5 && <StepGenerate />}
      </div>
    </div>
  )
}
