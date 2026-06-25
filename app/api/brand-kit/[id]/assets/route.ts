import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { brandKits, brandAssets } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { saveUploadedFile } from '@/lib/storage'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const { id } = await params
  const kit = await db
    .select()
    .from(brandKits)
    .where(and(eq(brandKits.id, id), eq(brandKits.userId, ctx.userId)))
    .get()
  if (!kit) return NextResponse.json({ error: 'Brand kit not found' }, { status: 404 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const type = (formData.get('type') as string) ?? 'product_image'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ALLOWED_MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  const ext = ALLOWED_MIME_TO_EXT[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP or GIF.' }, { status: 400 })
  }

  const ALLOWED_ASSET_TYPES = ['product_image', 'logo', 'watermark']
  const assetType = ALLOWED_ASSET_TYPES.includes(type) ? type : 'product_image'

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 })
  }

  const filename = `${ctx.userId}-${uuidv4()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await saveUploadedFile(buffer, filename, 'brand')

  const assetId = uuidv4()
  await db.insert(brandAssets).values({
    id: assetId,
    brandKitId: id,
    name: file.name,
    url,
    type: assetType,
    mimeType: file.type,
    sizeBytes: file.size,
  })

  const asset = await db.select().from(brandAssets).where(eq(brandAssets.id, assetId)).get()
  return NextResponse.json({ asset }, { status: 201 })
}
