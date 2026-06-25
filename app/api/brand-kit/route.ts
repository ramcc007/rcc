import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, isAuthError } from '@/lib/auth-utils'
import { db } from '@/lib/db'
import { brandKits, brandAssets } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const CreateBrandKitSchema = z.object({
  name: z.string().min(1),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  fontFamily: z.string().optional(),
})

export async function GET() {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const kits = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.userId, ctx.userId))
    .orderBy(desc(brandKits.createdAt))

  const kitsWithAssets = await Promise.all(
    kits.map(async (kit) => {
      const assets = await db
        .select()
        .from(brandAssets)
        .where(eq(brandAssets.brandKitId, kit.id))
      return { ...kit, assets }
    })
  )

  return NextResponse.json({ brandKits: kitsWithAssets })
}

export async function POST(request: NextRequest) {
  const ctx = await requireAuth()
  if (isAuthError(ctx)) return ctx

  const body = await request.json()
  const parsed = CreateBrandKitSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const id = uuidv4()
  await db.insert(brandKits).values({
    id,
    userId: ctx.userId,
    name: parsed.data.name,
    primaryColor: parsed.data.primaryColor ?? null,
    secondaryColor: parsed.data.secondaryColor ?? null,
    fontFamily: parsed.data.fontFamily ?? null,
  })

  const kit = await db.select().from(brandKits).where(eq(brandKits.id, id)).get()
  return NextResponse.json({ brandKit: kit }, { status: 201 })
}
