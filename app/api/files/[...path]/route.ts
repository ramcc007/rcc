import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@netlify/blobs'

const MIME: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  if (!path || path.length < 2) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const [subfolder, ...rest] = path
  const filename = rest.join('/')
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''

  const store = getStore(subfolder)
  const data = await store.get(filename, { type: 'arrayBuffer' })

  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(data, {
    headers: {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
