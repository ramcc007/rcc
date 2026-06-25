import { GoogleGenAI } from '@google/genai'

export function getGeminiClient(apiKey: string) {
  return new GoogleGenAI({ apiKey })
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = getGeminiClient(apiKey)
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Reply with just the word "ok"',
    })
    return !!response.text
  } catch {
    return false
  }
}
