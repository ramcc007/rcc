import { getGeminiClient } from './client'
import { buildScriptPrompt } from './prompts'
import type { ScriptGenerationParams, ScriptContent } from '@/lib/types'

function parseScriptJson(raw: string): ScriptContent {
  // Strip markdown code fences if present
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

export async function generateScript(
  params: ScriptGenerationParams,
  apiKey: string
): Promise<ScriptContent> {
  const client = getGeminiClient(apiKey)
  const prompt = buildScriptPrompt(params)

  // First attempt
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
    })
    return parseScriptJson(response.text ?? '')
  } catch (firstError) {
    // Retry with stricter instructions
    try {
      const retryPrompt = prompt + '\n\nCRITICAL: Return ONLY the raw JSON object. No markdown. No code fences. No explanation. Start your response with { and end with }'
      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: retryPrompt,
        config: {
          temperature: 0.5,
          maxOutputTokens: 2048,
        },
      })
      return parseScriptJson(response.text ?? '')
    } catch {
      throw new Error(`Script generation failed: ${firstError instanceof Error ? firstError.message : 'Unknown error'}`)
    }
  }
}
