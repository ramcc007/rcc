import { put, del } from '@vercel/blob'

export type UploadSubfolder = 'videos' | 'brand' | 'thumbnails'

export async function saveUploadedFile(
  buffer: Buffer,
  filename: string,
  subfolder: UploadSubfolder,
  contentType?: string
): Promise<string> {
  const defaultMime: Record<UploadSubfolder, string> = {
    videos: 'video/mp4',
    brand: 'image/jpeg',
    thumbnails: 'image/jpeg',
  }

  const { url } = await put(`${subfolder}/${filename}`, buffer, {
    access: 'public',
    contentType: contentType ?? defaultMime[subfolder],
  })
  return url
}

export function getPublicUrl(url: string): string {
  return url
}

export async function deleteFile(publicUrl: string): Promise<void> {
  try {
    await del(publicUrl)
  } catch {
    // Ignore — file may not exist
  }
}
