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

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP or GIF.' }, { status: 400 })
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${ctx.userId}-${uuidv4()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await saveUploadedFile(buffer, filename, 'brand')

  const assetId = uuidv4()
  await db.insert(brandAssets).values({
    id: assetId,
    brandKitId: id,
    name: file.name,
    url,
    type,
    mimeType: file.type,
    sizeBytes: file.size,
  })

  const asset = await db.select().from(brandAssets).where(eq(brandAssets.id, assetId)).get()
  return NextResponse.json({ asset }, { status: 201 })
}
