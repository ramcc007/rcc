const FAL_MODEL = 'fal-ai/kling-video/v1.6/standard/text-to-video'
const FAL_QUEUE = `https://queue.fal.run/${FAL_MODEL}`

export interface FalVideoRequest {
  prompt: string
  aspectRatio: '9:16' | '16:9' | '1:1'
  duration?: 5 | 10
  apiKey: string
}

export interface FalPollResult {
  done: boolean
  videoUrl?: string
  error?: string
}

export async function initiateFalVideoGeneration({
  prompt,
  aspectRatio,
  duration = 5,
  apiKey,
}: FalVideoRequest): Promise<{ requestId: string }> {
  const res = await fetch(FAL_QUEUE, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: aspectRatio,
      duration: String(duration),
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`fal.ai error ${res.status}: ${body}`)
  }

  const data = await res.json()
  if (!data.request_id) throw new Error('fal.ai did not return a request_id')
  return { requestId: data.request_id as string }
}

export async function pollFalOperation({
  requestId,
  apiKey,
}: {
  requestId: string
  apiKey: string
}): Promise<FalPollResult> {
  const statusRes = await fetch(`${FAL_QUEUE}/requests/${requestId}/status`, {
    headers: { Authorization: `Key ${apiKey}` },
  })

  if (!statusRes.ok) {
    throw new Error(`fal.ai status check failed: ${statusRes.status}`)
  }

  const status = await statusRes.json()

  if (status.status === 'FAILED') {
    return { done: true, error: status.error ?? 'Video generation failed on fal.ai' }
  }

  if (status.status !== 'COMPLETED') {
    return { done: false }
  }

  const resultRes = await fetch(`${FAL_QUEUE}/requests/${requestId}`, {
    headers: { Authorization: `Key ${apiKey}` },
  })

  if (!resultRes.ok) {
    return { done: true, error: `fal.ai result fetch failed: ${resultRes.status}` }
  }

  const result = await resultRes.json()
  const videoUrl: string | undefined = result.video?.url
  if (!videoUrl) return { done: true, error: 'No video URL in fal.ai result' }
  return { done: true, videoUrl }
}

export async function downloadFalVideo(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download fal.ai video: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}
