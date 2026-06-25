export type HookType =
  | 'problem-led'
  | 'result-led'
  | 'question-based'
  | 'controversial'
  | 'visual-disruption'

export type FunnelStage = 'awareness' | 'consideration' | 'conversion' | 'retention'

export type CTAType = 'soft' | 'friction' | 'urgency' | 'loyalty'

export type ToneType = 'authentic' | 'polished' | 'humorous' | 'expert' | 'peer-recommended'

export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'facebook'

export type PersonaArchetype = 'mom' | 'genz' | 'lifestyle' | 'expert' | 'everyday'

export type ProductCategory =
  | 'beauty'
  | 'fitness'
  | 'tech'
  | 'food'
  | 'fashion'
  | 'home'
  | 'finance'
  | 'saas'

export type VideoJobStatus =
  | 'queued'
  | 'generating'
  | 'post_processing'
  | 'review'
  | 'approved'
  | 'failed'
  | 'exported'

export type AspectRatio = '9:16' | '16:9' | '1:1'

export type Resolution = '720p' | '1080p' | '4k'

export interface SceneBreakdown {
  sceneNumber: number
  duration: number
  visualDescription: string
  voiceover: string
}

export interface ScriptContent {
  hook: string
  problem: string
  product: string
  cta: string
  fullText: string
  sceneBreakdown: SceneBreakdown[]
}

export interface CharacterDescription {
  ageRange: string
  ethnicity: string
  gender: string
  persona: 'professional' | 'casual' | 'authentic'
}

export interface ScriptFilters {
  hookType: HookType
  funnelStage: FunnelStage
  ctaType: CTAType
  tone: ToneType
  platform: Platform
  duration: number
  persona: PersonaArchetype
}

export interface CampaignBrief {
  name: string
  productName: string
  productCategory: ProductCategory
  targetAudience: string
  brandVoice?: string
  competitorNames?: string[]
  brandKitId?: string
}

export interface VideoSettings {
  aspectRatio: AspectRatio
  resolution: Resolution
  characterDesc: CharacterDescription
  referenceImageUrls: string[]
  generateDisclosureOverlay: boolean
  generateAILabel: boolean
  disclosureTiming: 'beginning' | 'end' | 'throughout'
  variantCount: 1 | 2 | 3
}

export interface ComplianceCheck {
  id: string
  label: string
  passed: boolean
  points: number
  required: boolean
  description: string
}

export interface PlatformRule {
  platform: Platform
  rule: string
  met: boolean
}

export interface ComplianceReport {
  score: number
  badge: 'compliant' | 'needs-review' | 'non-compliant'
  checks: ComplianceCheck[]
  warnings: string[]
  platformRules: PlatformRule[]
}

export interface QualityCheck {
  id: string
  label: string
  passed: boolean
  points: number
  detail: string
}

export interface QualityReport {
  score: number
  rating: 'excellent' | 'good' | 'acceptable' | 'needs-regeneration'
  checks: QualityCheck[]
}

export interface ScriptGenerationParams {
  productName: string
  productCategory: ProductCategory
  targetAudience: string
  brandVoice?: string
  competitorNames?: string[]
  hookType: HookType
  funnelStage: FunnelStage
  ctaType: CTAType
  tone: ToneType
  platform: Platform
  duration: number
  persona: PersonaArchetype
}

export interface VideoGenerationParams {
  prompt: string
  aspectRatio: AspectRatio
  referenceImageBase64?: string
  apiKey: string
}

export interface UserSettings {
  id: string
  email: string
  name: string | null
  image: string | null
  hasGeminiKey: boolean
  defaultPlatform: string
  defaultAspectRatio: string
}
