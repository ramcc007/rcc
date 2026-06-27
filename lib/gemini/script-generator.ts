import { getGeminiClient } from './client'
import { buildScriptPrompt } from './prompts'
import type { ScriptGenerationParams, ScriptContent } from '@/lib/types'

// Models confirmed available in @google/genai v1beta (no deprecated 1.5 series)
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']

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

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')
}

async function tryGenerate(client: ReturnType<typeof getGeminiClient>, model: string, prompt: string): Promise<ScriptContent> {
  const response = await client.models.generateContent({
    model,
    contents: prompt,
    config: { temperature: 0.8, maxOutputTokens: 2048 },
  })
  return parseScriptJson(response.text ?? '')
}

export async function generateScript(
  params: ScriptGenerationParams,
  apiKey: string
): Promise<ScriptContent> {
  const client = getGeminiClient(apiKey)
  const prompt = buildScriptPrompt(params)
  const strictPrompt = prompt + '\n\nCRITICAL: Return ONLY the raw JSON object. No markdown. No code fences. Start with { and end with }'

  let lastError: unknown

  for (const model of MODELS) {
    try {
      return await tryGenerate(client, model, prompt)
    } catch (err) {
      lastError = err
      // On first fail, retry with stricter JSON prompt
      try {
        return await tryGenerate(client, model, strictPrompt)
      } catch (retryErr) {
        lastError = retryErr
        // Always continue to next model
      }
    }
  }

  // Translate common errors to friendly messages
  const msg = lastError instanceof Error ? lastError.message : String(lastError)
  if (isQuotaError(lastError)) {
    throw new Error(`Gemini quota error: ${msg}. Your API key may be linked to a billing-enabled project — create a fresh key on a new project at aistudio.google.com.`)
  }
  if (msg.includes('API_KEY_INVALID') || msg.includes('401')) {
    throw new Error('Invalid Gemini API key. Please update it in Settings.')
  }
  if (msg.includes('404') || msg.includes('NOT_FOUND')) {
    throw new Error('Gemini model not available for your API key. Make sure your key is from aistudio.google.com (not Google Cloud Console).')
  }
  throw new Error(`Script generation failed: ${msg}`)
}
