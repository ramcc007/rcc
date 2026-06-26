'use client'
import { create } from 'zustand'
import type {
  CampaignBrief,
  ScriptFilters,
  ScriptContent,
  VideoSettings,
  HookType,
  FunnelStage,
  CTAType,
  ToneType,
  Platform,
  PersonaArchetype,
  AspectRatio,
  CharacterDescription,
} from '@/lib/types'

interface WizardState {
  currentStep: number
  campaignId: string | null
  scriptId: string | null
  activeJobId: string | null

  campaignData: Partial<CampaignBrief>
  scriptFilters: ScriptFilters
  generatedScript: ScriptContent | null
  videoSettings: VideoSettings

  setStep: (step: number) => void
  setCampaignId: (id: string) => void
  setScriptId: (id: string) => void
  setActiveJobId: (id: string | null) => void
  setCampaignData: (data: Partial<CampaignBrief>) => void
  setScriptFilters: (filters: Partial<ScriptFilters>) => void
  setGeneratedScript: (script: ScriptContent) => void
  setVideoSettings: (settings: Partial<VideoSettings>) => void
  preloadCampaign: (id: string, data: Partial<CampaignBrief>) => void
  reset: () => void
}

const DEFAULT_FILTERS: ScriptFilters = {
  hookType: 'problem-led' as HookType,
  funnelStage: 'consideration' as FunnelStage,
  ctaType: 'soft' as CTAType,
  tone: 'authentic' as ToneType,
  platform: 'tiktok' as Platform,
  duration: 30,
  persona: 'everyday' as PersonaArchetype,
}

const DEFAULT_CHARACTER: CharacterDescription = {
  ageRange: '25-35',
  ethnicity: 'diverse',
  gender: 'woman',
  persona: 'authentic',
}

const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  aspectRatio: '9:16' as AspectRatio,
  resolution: '1080p',
  characterDesc: DEFAULT_CHARACTER,
  referenceImageUrls: [],
  generateDisclosureOverlay: true,
  generateAILabel: true,
  disclosureTiming: 'beginning',
  variantCount: 1,
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  campaignId: null,
  scriptId: null,
  activeJobId: null,
  campaignData: {},
  scriptFilters: DEFAULT_FILTERS,
  generatedScript: null,
  videoSettings: DEFAULT_VIDEO_SETTINGS,

  setStep: (step) => set({ currentStep: step }),
  setCampaignId: (id) => set({ campaignId: id }),
  setScriptId: (id) => set({ scriptId: id }),
  setActiveJobId: (id) => set({ activeJobId: id }),
  setCampaignData: (data) => set((s) => ({ campaignData: { ...s.campaignData, ...data } })),
  setScriptFilters: (filters) => set((s) => ({ scriptFilters: { ...s.scriptFilters, ...filters } })),
  setGeneratedScript: (script) => set({ generatedScript: script }),
  setVideoSettings: (settings) =>
    set((s) => ({ videoSettings: { ...s.videoSettings, ...settings } })),
  preloadCampaign: (id, data) =>
    set({ campaignId: id, campaignData: data, currentStep: 2, scriptId: null, activeJobId: null, generatedScript: null }),
  reset: () =>
    set({
      currentStep: 1,
      campaignId: null,
      scriptId: null,
      activeJobId: null,
      campaignData: {},
      scriptFilters: DEFAULT_FILTERS,
      generatedScript: null,
      videoSettings: DEFAULT_VIDEO_SETTINGS,
    }),
}))
