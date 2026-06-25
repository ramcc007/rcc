import { describe, it, expect } from 'vitest'
import { checkCompliance } from '@/lib/compliance/engine'
import type { ComplianceInput } from '@/lib/compliance/engine'

const base: ComplianceInput = {
  scriptText: 'This product is amazing and works well.',
  platform: 'tiktok',
  aspectRatio: '9:16',
  hasDisclosureOverlay: true,
  disclosureInFirstThreeSeconds: true,
  hasAILabel: true,
}

describe('checkCompliance scoring', () => {
  it('returns score 100 when all checks pass', () => {
    expect(checkCompliance(base).score).toBe(100)
    // 25 (disclosure) + 20 (ai label) + 20 (early disclosure) + 15 (platform format) + 20 (no claims) = 100
  })

  it('returns score 0 when all checks fail', () => {
    const result = checkCompliance({
      ...base,
      hasDisclosureOverlay: false,
      disclosureInFirstThreeSeconds: false,
      hasAILabel: false,
      aspectRatio: '16:9',
      scriptText: 'guaranteed cure 100% effective',
    })
    expect(result.score).toBe(0)
  })

  it('scores only the disclosure check (25 pts) when others fail', () => {
    const result = checkCompliance({
      ...base,
      disclosureInFirstThreeSeconds: false,
      hasAILabel: false,
      aspectRatio: '16:9',
      scriptText: 'miracle cure guaranteed',
    })
    expect(result.score).toBe(25)
  })
})

describe('checkCompliance badge thresholds', () => {
  it('assigns compliant badge at score 100', () => {
    expect(checkCompliance(base).badge).toBe('compliant')
  })

  it('assigns compliant badge at score 80', () => {
    // fail: ai label (−20) → score 80
    const result = checkCompliance({ ...base, hasAILabel: false })
    expect(result.score).toBe(80)
    expect(result.badge).toBe('compliant')
  })

  it('assigns needs-review badge at score 79', () => {
    // fail: ai label (−20) + early disclosure (−20) → 60
    const result = checkCompliance({
      ...base,
      hasAILabel: false,
      disclosureInFirstThreeSeconds: false,
    })
    expect(result.score).toBe(60)
    expect(result.badge).toBe('needs-review')
  })

  it('assigns non-compliant badge at score < 50', () => {
    // fail: disclosure (−25) + ai label (−20) + early (−20) → 15
    const result = checkCompliance({
      ...base,
      hasDisclosureOverlay: false,
      hasAILabel: false,
      disclosureInFirstThreeSeconds: false,
    })
    expect(result.score).toBe(35)
    expect(result.badge).toBe('non-compliant')
  })
})

describe('check: platform format', () => {
  it('fails tiktok with 16:9 aspect ratio', () => {
    const result = checkCompliance({ ...base, aspectRatio: '16:9' })
    const check = result.checks.find(c => c.id === 'platform_format')!
    expect(check.passed).toBe(false)
    expect(result.score).toBe(85)
  })

  it('passes youtube with 16:9', () => {
    const result = checkCompliance({ ...base, platform: 'youtube', aspectRatio: '16:9' })
    expect(result.checks.find(c => c.id === 'platform_format')!.passed).toBe(true)
  })

  it('passes instagram with 1:1', () => {
    const result = checkCompliance({ ...base, platform: 'instagram', aspectRatio: '1:1' })
    expect(result.checks.find(c => c.id === 'platform_format')!.passed).toBe(true)
  })

  it('passes facebook with all three aspect ratios', () => {
    for (const ar of ['9:16', '16:9', '1:1'] as const) {
      const result = checkCompliance({ ...base, platform: 'facebook', aspectRatio: ar })
      expect(result.checks.find(c => c.id === 'platform_format')!.passed).toBe(true)
    }
  })
})

describe('check: prohibited claims', () => {
  it('fails when script contains a prohibited phrase', () => {
    const result = checkCompliance({ ...base, scriptText: 'guaranteed results overnight' })
    expect(result.checks.find(c => c.id === 'no_prohibited_claims')!.passed).toBe(false)
  })

  it('is case-insensitive', () => {
    const result = checkCompliance({ ...base, scriptText: 'GUARANTEED weight loss' })
    expect(result.checks.find(c => c.id === 'no_prohibited_claims')!.passed).toBe(false)
  })

  it('passes with a clean script', () => {
    const result = checkCompliance({ ...base, scriptText: 'A great product you will love.' })
    expect(result.checks.find(c => c.id === 'no_prohibited_claims')!.passed).toBe(true)
  })

  it('detects "miracle" as prohibited', () => {
    const result = checkCompliance({ ...base, scriptText: 'This miracle product changed my life' })
    expect(result.checks.find(c => c.id === 'no_prohibited_claims')!.passed).toBe(false)
  })
})

describe('warnings', () => {
  it('includes FTC warning when disclosure overlay is missing', () => {
    const result = checkCompliance({ ...base, hasDisclosureOverlay: false })
    expect(result.warnings.some(w => w.includes('FTC'))).toBe(true)
  })

  it('includes AI label warning when ai label is missing', () => {
    const result = checkCompliance({ ...base, hasAILabel: false })
    expect(result.warnings.some(w => w.includes('AI-generated'))).toBe(true)
  })

  it('has no warnings for fully compliant input', () => {
    expect(checkCompliance(base).warnings).toHaveLength(0)
  })
})

describe('platformRules', () => {
  it('returns rules for the requested platform only', () => {
    const result = checkCompliance(base)
    expect(result.platformRules.every(r => r.platform === 'tiktok')).toBe(true)
    expect(result.platformRules.length).toBeGreaterThan(0)
  })

  it('returns different rules for youtube', () => {
    const result = checkCompliance({ ...base, platform: 'youtube', aspectRatio: '16:9' })
    expect(result.platformRules.every(r => r.platform === 'youtube')).toBe(true)
  })

  it('marks rules as met when disclosure is present', () => {
    const result = checkCompliance(base)
    expect(result.platformRules.every(r => r.met === true)).toBe(true)
  })

  it('marks rules as not met when disclosure is absent', () => {
    const result = checkCompliance({ ...base, hasDisclosureOverlay: false })
    expect(result.platformRules.every(r => r.met === false)).toBe(true)
  })
})
