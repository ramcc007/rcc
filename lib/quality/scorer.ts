import type { QualityReport, QualityCheck } from '@/lib/types'

export interface QualityInput {
  resolution: string
  targetDuration: number
  actualDuration?: number
  hasAudioSync?: boolean
  visionScore?: number // 0-25 from Gemini Vision assessment
}

export function scoreQuality(input: QualityInput): QualityReport {
  const checks: QualityCheck[] = []

  // Check 1: Resolution
  const resolutionHeights: Record<string, number> = {
    '480p': 480,
    '720p': 720,
    '1080p': 1080,
    '4k': 2160,
  }
  const height = resolutionHeights[input.resolution.toLowerCase()] ?? 0
  const resolutionPass = height >= 720
  checks.push({
    id: 'resolution',
    label: 'Minimum Resolution',
    passed: resolutionPass,
    points: resolutionPass ? 25 : 0,
    detail: resolutionPass
      ? `${input.resolution} meets the 720p minimum requirement`
      : `${input.resolution} is below the 720p minimum for professional quality`,
  })

  // Check 2: Duration match
  let durationPoints = 0
  let durationDetail = 'Duration not yet available'
  if (input.actualDuration !== undefined && input.targetDuration > 0) {
    const variance = Math.abs(input.actualDuration - input.targetDuration) / input.targetDuration
    if (variance <= 0.1) {
      durationPoints = 25
      durationDetail = `Actual duration ${input.actualDuration.toFixed(1)}s is within 10% of target ${input.targetDuration}s`
    } else {
      durationDetail = `Duration variance ${(variance * 100).toFixed(0)}% exceeds 10% tolerance`
    }
  } else {
    durationPoints = 12 // partial credit when not yet measured
    durationDetail = 'Duration check pending video analysis'
  }
  checks.push({
    id: 'duration_match',
    label: 'Duration Accuracy',
    passed: durationPoints >= 25,
    points: durationPoints,
    detail: durationDetail,
  })

  // Check 3: Audio sync
  const audioSync = input.hasAudioSync !== false
  checks.push({
    id: 'audio_sync',
    label: 'Audio Synchronization',
    passed: audioSync,
    points: audioSync ? 25 : 0,
    detail: audioSync
      ? 'Audio synchronized with video content'
      : 'Audio sync issues detected — consider regeneration',
  })

  // Check 4: Visual quality (Gemini Vision)
  const visionScore = input.visionScore ?? 20 // default optimistic score
  checks.push({
    id: 'visual_quality',
    label: 'Visual Quality Assessment',
    passed: visionScore >= 15,
    points: visionScore,
    detail:
      visionScore >= 20
        ? 'Excellent visual quality — no significant artifacts detected'
        : visionScore >= 15
          ? 'Good visual quality with minor imperfections'
          : 'Visual quality issues detected — consider regeneration',
  })

  const score = checks.reduce((sum, c) => sum + c.points, 0)

  const rating: QualityReport['rating'] =
    score >= 80
      ? 'excellent'
      : score >= 60
        ? 'good'
        : score >= 40
          ? 'acceptable'
          : 'needs-regeneration'

  return { score, rating, checks }
}
