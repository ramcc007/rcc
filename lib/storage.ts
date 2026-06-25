import { writeFile, unlink, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const UPLOADS_BASE = path.join(process.cwd(), 'public', 'uploads')

export type UploadSubfolder = 'videos' | 'brand' | 'thumbnails'

export async function saveUploadedFile(
  buffer: Buffer,
  filename: string,
  subfolder: UploadSubfolder
): Promise<string> {
  const dir = path.join(UPLOADS_BASE, subfolder)
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
  const filePath = path.join(dir, filename)
  await writeFile(filePath, buffer)
  return `/uploads/${subfolder}/${filename}`
}

export function getPublicUrl(filename: string, subfolder: UploadSubfolder): string {
  return `/uploads/${subfolder}/${filename}`
}

export async function deleteFile(publicUrl: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'public', publicUrl)
  if (existsSync(filePath)) {
    await unlink(filePath)
  }
}
