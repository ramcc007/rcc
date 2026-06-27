import Groq from 'groq-sdk'

export function getGroqClient(apiKey: string) {
  return new Groq({ apiKey })
}

export async function testGroqApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = getGroqClient(apiKey)
    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Reply with the word ok.' }],
      max_tokens: 5,
    })
    return !!response.choices[0]?.message?.content
  } catch {
    return false
  }
}
