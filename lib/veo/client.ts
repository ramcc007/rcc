import { getGeminiClient } from '@/lib/gemini/client'
import type { GenerateVideosOperation } from '@google/genai'

export interface VideoGenerationResult {
  operationName: string
}

export interface VideoOperationStatus {
  done: boolean
  videoUrl?: string
  thumbnailUrl?: string
  error?: string
}

export async function initiateVideoGeneration(params: {
  prompt: string
  aspectRatio: '9:16' | '16:9' | '1:1'
  apiKey: string
}): Promise<VideoGenerationResult> {
  const client = getGeminiClient(params.apiKey)

  const operation = await client.models.generateVideos({
    model: 'veo-3.0-generate-preview',
    prompt: params.prompt,
    config: {
      aspectRatio: params.aspectRatio,
      numberOfVideos: 1,
    },
  })

  const operationName = operation.name
  if (!operationName) {
    throw new Error('Video generation did not return an operation name')
  }

  return { operationName }
}

export async function pollVideoOperation(params: {
  operationName: string
  apiKey: string
}): Promise<VideoOperationStatus> {
  const client = getGeminiClient(params.apiKey)

  try {
    const operation = await client.operations.getVideosOperation({
      operation: { name: params.operationName } as unknown as GenerateVideosOperation,
    })

    if (!operation.done) {
      return { done: false }
    }

    if (operation.error) {
      const errMsg = (operation.error as unknown as { message?: string }).message ?? 'Unknown error'
      return { done: true, error: errMsg }
    }

    const videoUrl = operation.response?.generatedVideos?.[0]?.video?.uri

    if (!videoUrl) {
      return { done: true, error: 'No video URI in completed operation' }
    }

    return { done: true, videoUrl }
  } catch (error) {
    return {
      done: false,
      error: error instanceof Error ? error.message : 'Poll failed',
    }
  }
}

export async function downloadVideo(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.status} ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
