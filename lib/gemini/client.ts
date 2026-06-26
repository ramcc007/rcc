import { GoogleGenAI } from '@google/genai'

export function getGeminiClient(apiKey: string) {
  return new GoogleGenAI({ apiKey })
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = getGeminiClient(apiKey)
    // List models — lightweight auth check, no token cost, works for all valid keys
    const models = client.models.list()
    return !!(await models)
  } catch {
    return false
  }
}
