import { GoogleGenAI } from '@google/genai'

export function getGeminiClient(apiKey: string) {
  return new GoogleGenAI({ apiKey })
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = getGeminiClient(apiKey)
    // Minimal generation test — verifies both auth AND generation quota
    await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Reply with the word ok.',
      config: { maxOutputTokens: 5 },
    })
    return true
  } catch {
    return false
  }
}
