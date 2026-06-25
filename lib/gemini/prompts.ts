import type { ScriptGenerationParams, SceneBreakdown } from '@/lib/types'

const HOOK_DESCRIPTIONS: Record<string, string> = {
  'problem-led': 'Open by calling out a painful problem the viewer has RIGHT NOW',
  'result-led': 'Open with a jaw-dropping result or transformation first',
  'question-based': 'Open with a provocative question that makes viewers stop scrolling',
  controversial: 'Open with a bold, controversial opinion that challenges conventional wisdom',
  'visual-disruption': 'Open with an unexpected visual action or surprise that demands attention',
}

const FUNNEL_GUIDANCE: Record<string, string> = {
  awareness: 'Focus on the problem and why it matters. Do NOT hard-sell. Build curiosity.',
  consideration: 'Compare options subtly. Highlight unique differentiators. Build desire.',
  conversion: 'Remove objections. Use social proof. Drive urgency. Close the sale.',
  retention: 'Reinforce the decision. Show community/results. Encourage loyalty.',
}

const CTA_EXAMPLES: Record<string, string> = {
  soft: '"Check the link in bio to learn more" — low friction, curiosity-based',
  friction: '"Drop a comment below if you struggle with this too" — engagement-focused',
  urgency: '"Offer ends this Sunday — grab yours now" — scarcity/time-based',
  loyalty: '"Join thousands of us who made the switch" — community/tribe appeal',
}

const PERSONA_VOICE: Record<string, string> = {
  mom: 'Speak like a busy, relatable mom sharing a genuine find with a friend',
  genz: 'Use casual, fast-paced language. Short sentences. Very conversational and self-aware.',
  lifestyle: 'Aspirational but attainable. Aesthetic, polished but still personal',
  expert: 'Confident, knowledgeable, data-backed. Establish credibility quickly.',
  everyday: 'Completely average person — no pretense. Pure authenticity and relatability.',
}

const PLATFORM_NOTES: Record<string, string> = {
  tiktok: 'Very fast-paced. Hook in 1 second. Use trending verbal patterns. End strong.',
  instagram: 'Slightly more polished. Good lighting descriptions. Aesthetic matters.',
  youtube: 'Can be slightly longer/conversational. Viewer retention patterns.',
  facebook: 'Slightly older demographic. Benefit-focused. Can be more explanatory.',
}

const DURATION_WORD_COUNT: Record<number, { min: number; max: number; scenes: number }> = {
  15: { min: 30, max: 45, scenes: 2 },
  30: { min: 60, max: 80, scenes: 3 },
  60: { min: 120, max: 150, scenes: 4 },
  90: { min: 180, max: 220, scenes: 5 },
}

export function buildScriptPrompt(params: ScriptGenerationParams): string {
  const wordCount = DURATION_WORD_COUNT[params.duration] ?? DURATION_WORD_COUNT[30]

  return `You are a world-class UGC (User-Generated Content) video script writer with deep expertise in performance marketing. Your scripts consistently outperform branded content by 4x in CTR and conversion.

PRODUCT: "${params.productName}"
CATEGORY: ${params.productCategory}
TARGET AUDIENCE: ${params.targetAudience}
BRAND VOICE: ${params.brandVoice ?? 'Friendly, authentic, and relatable'}
${params.competitorNames?.length ? `COMPETITORS TO SUBTLY OUTSHINE: ${params.competitorNames.join(', ')}` : ''}

SCRIPT REQUIREMENTS:
- Hook Type: ${HOOK_DESCRIPTIONS[params.hookType]}
- Funnel Stage: ${FUNNEL_GUIDANCE[params.funnelStage]}
- CTA Style: ${CTA_EXAMPLES[params.ctaType]}
- Tone/Voice: ${PERSONA_VOICE[params.persona]}
- Platform: ${PLATFORM_NOTES[params.platform]}
- Duration: ${params.duration} seconds (${wordCount.min}–${wordCount.max} spoken words total)
- Number of scenes: ${wordCount.scenes}

FRAMEWORK: Hook → Problem → Product → CTA
- HOOK (${params.duration <= 30 ? '1-3' : '2-5'} sec): ${HOOK_DESCRIPTIONS[params.hookType]}. This MUST stop the scroll instantly.
- PROBLEM (${params.duration <= 30 ? '3-8' : '5-15'} sec): Agitate the problem. Make the viewer feel seen and understood.
- PRODUCT (${params.duration <= 30 ? '5-15' : '15-50'} sec): Introduce the solution naturally. Show/describe benefits NOT features. Make it feel like a personal recommendation.
- CTA (${params.duration <= 30 ? '2-5' : '5-10'} sec): ${CTA_EXAMPLES[params.ctaType]}

COMPLIANCE NOTES:
- If this is a paid promotion, the script should naturally accommodate a disclosure overlay
- Avoid superlative claims like "best ever", "guaranteed results", "cure", "100% effective"
- Keep claims believable and authentic

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "hook": "The exact opening line(s) — the first words spoken",
  "problem": "The problem/agitation section text",
  "product": "The product introduction and benefit section text",
  "cta": "The call-to-action text",
  "fullText": "Complete script text in natural speaking order",
  "sceneBreakdown": [
    {
      "sceneNumber": 1,
      "duration": 5,
      "visualDescription": "Detailed visual description for video generation — what the camera sees, character action, environment, lighting",
      "voiceover": "Exact words spoken in this scene"
    }
  ]
}`
}

export function buildVeoPromptFromScript(
  productName: string,
  scene: SceneBreakdown,
  characterDesc: { ageRange: string; ethnicity: string; gender: string; persona: string },
  platform: string,
  tone: string
): string {
  const styleGuide = tone === 'authentic' || tone === 'peer-recommended'
    ? 'authentic handheld footage, slightly raw, natural lighting, genuine emotion, smartphone aesthetic'
    : 'clean handheld footage, natural lighting, warm tones, cinematic quality'

  const personaStyle = characterDesc.persona === 'authentic'
    ? 'casual home setting, everyday clothing, no professional styling'
    : characterDesc.persona === 'professional'
      ? 'clean modern environment, smart-casual attire, confident posture'
      : 'lifestyle setting, trendy attire, relaxed and natural'

  return `${characterDesc.ageRange}-year-old ${characterDesc.ethnicity} ${characterDesc.gender} person, ${personaStyle}. ${scene.visualDescription}. Product: ${productName}. ${styleGuide}. Short-form ${platform} UGC video style. Duration: approximately ${scene.duration} seconds. High quality, no text overlays, ${platform === 'tiktok' || platform === 'instagram' ? 'vertical 9:16 format' : 'landscape format'}.`
}

export function buildQualityAssessmentPrompt(videoDescription: string): string {
  return `Assess this UGC video for quality issues. Video description: "${videoDescription}".

Rate on a scale of 0-25 for visual quality (look for: compression artifacts, excessive blur, unnatural movements, poor lighting, visual glitches).

Return ONLY valid JSON:
{"score": <0-25>, "issues": ["issue1", "issue2"], "strengths": ["strength1"]}`
}
