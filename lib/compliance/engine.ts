import type { ComplianceReport, ComplianceCheck, Platform, PlatformRule } from '@/lib/types'

const PROHIBITED_CLAIMS = [
  'guaranteed',
  'best ever',
  '100% effective',
  'cure',
  'instantly lose',
  'miracle',
  'clinically proven to',
  'scientifically proven to',
  'eliminate all',
]

const PLATFORM_RULES: Record<Platform, PlatformRule[]> = {
  tiktok: [
    { platform: 'tiktok', rule: 'Add #ad or #sponsored in video caption', met: false },
    { platform: 'tiktok', rule: 'Visual disclosure overlay in first 3 seconds', met: false },
    { platform: 'tiktok', rule: 'Use TikTok\'s "Paid Partnership" content toggle', met: false },
  ],
  instagram: [
    { platform: 'instagram', rule: 'Enable "Paid Partnership" label in account settings', met: false },
    { platform: 'instagram', rule: 'Verbal or visual disclosure visible before "See More" cutoff', met: false },
  ],
  youtube: [
    { platform: 'youtube', rule: 'Check "video contains paid promotion" in YouTube Studio', met: false },
    { platform: 'youtube', rule: 'Verbal disclosure in first 30 seconds of video', met: false },
    { platform: 'youtube', rule: 'Written disclosure above "Show more" in description', met: false },
  ],
  facebook: [
    { platform: 'facebook', rule: 'Use Facebook\'s "Paid Partnership" tagging feature', met: false },
    { platform: 'facebook', rule: 'Clear brand mention within first 3 seconds', met: false },
  ],
}

export interface ComplianceInput {
  scriptText: string
  platform: Platform
  aspectRatio: string
  hasDisclosureOverlay: boolean
  disclosureInFirstThreeSeconds: boolean
  hasAILabel: boolean
}

export function checkCompliance(input: ComplianceInput): ComplianceReport {
  const checks: ComplianceCheck[] = []

  // Check 1: Paid disclosure
  const hasPaidDisclosure = input.hasDisclosureOverlay
  checks.push({
    id: 'has_paid_disclosure',
    label: 'Paid Partnership Disclosure',
    passed: hasPaidDisclosure,
    points: 25,
    required: true,
    description: 'Video includes #ad, "Paid Partnership", or equivalent disclosure',
  })

  // Check 2: AI content label
  checks.push({
    id: 'has_ai_label',
    label: 'AI-Generated Content Label',
    passed: input.hasAILabel,
    points: 20,
    required: true,
    description: 'Content is labeled as AI-generated per platform requirements',
  })

  // Check 3: Early disclosure
  checks.push({
    id: 'disclosure_early',
    label: 'Disclosure Within First 3 Seconds',
    passed: input.disclosureInFirstThreeSeconds,
    points: 20,
    required: true,
    description: 'FTC requires disclosure to be "clear and conspicuous" — not buried',
  })

  // Check 4: Platform format match
  const platformAspectMap: Record<Platform, string[]> = {
    tiktok: ['9:16'],
    instagram: ['9:16', '1:1'],
    youtube: ['9:16', '16:9'],
    facebook: ['9:16', '16:9', '1:1'],
  }
  const platformMatch = platformAspectMap[input.platform]?.includes(input.aspectRatio) ?? false
  checks.push({
    id: 'platform_format',
    label: 'Platform-Appropriate Format',
    passed: platformMatch,
    points: 15,
    required: false,
    description: `${input.platform} works best with ${platformAspectMap[input.platform]?.join(' or ')} format`,
  })

  // Check 5: No prohibited claims
  const lowerScript = input.scriptText.toLowerCase()
  const foundClaims = PROHIBITED_CLAIMS.filter(claim => lowerScript.includes(claim))
  const noProhibitedClaims = foundClaims.length === 0
  checks.push({
    id: 'no_prohibited_claims',
    label: 'No Prohibited Claims',
    passed: noProhibitedClaims,
    points: 20,
    required: false,
    description: noProhibitedClaims
      ? 'No unsubstantiated superlatives or prohibited health claims detected'
      : `Detected potentially problematic phrases: ${foundClaims.join(', ')}`,
  })

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.points : 0), 0)

  const badge: ComplianceReport['badge'] =
    score >= 80 ? 'compliant' : score >= 50 ? 'needs-review' : 'non-compliant'

  const warnings: string[] = []
  if (!hasPaidDisclosure) {
    warnings.push('FTC requires clear disclosure of material connections. Violation can result in fines up to $50,120 per incident.')
  }
  if (!input.hasAILabel) {
    warnings.push('TikTok, Instagram, and YouTube require AI-generated content to be labeled.')
  }
  if (foundClaims.length > 0) {
    warnings.push(`Review claims: "${foundClaims.join('", "')}" may require substantiation.`)
  }

  const platformRules = (PLATFORM_RULES[input.platform] ?? []).map(rule => ({
    ...rule,
    met: hasPaidDisclosure,
  }))

  return { score, badge, checks, warnings, platformRules }
}
