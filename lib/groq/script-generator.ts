import { getGroqClient } from './client'
import { buildScriptPrompt } from '@/lib/gemini/prompts'
import type { ScriptGenerationParams, ScriptContent } from '@/lib/types'

// Models in preference order — all on Groq free tier
const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32768',
  'llama-3.1-8b-instant',
]

function parseScriptJson(raw: string): ScriptContent {
  const cleaned = raw
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim()

  const parsed = JSON.parse(cleaned)
  if (!parsed.hook || !parsed.fullText || !Array.isArray(parsed.sceneBreakdown)) {
    throw new Error('Invalid script structure returned by AI')
  }
  return parsed as ScriptContent
}

export async function generateScriptWithGroq(
  params: ScriptGenerationParams,
  apiKey: string
): Promise<ScriptContent> {
  const client = getGroqClient(apiKey)
  const prompt = buildScriptPrompt(params)

  let lastError: unknown

  for (const model of MODELS) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 2048,
        // Forces valid JSON output — no markdown fences, no preamble
        response_format: { type: 'json_object' },
      })
      const text = response.choices[0]?.message?.content ?? ''
      return parseScriptJson(text)
    } catch (err) {
      lastError = err
      // Continue to next model
    }
  }

  const msg = lastError instanceof Error ? lastError.message : String(lastError)
  if (msg.includes('rate_limit') || msg.includes('429')) {
    throw new Error('Groq rate limit hit. Wait a moment and try again.')
  }
  if (msg.includes('invalid_api_key') || msg.includes('401')) {
    throw new Error('Invalid Groq API key. Please update it in Settings.')
  }
  throw new Error(`Script generation failed: ${msg}`)
}
