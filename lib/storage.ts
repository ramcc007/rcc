import { getStore } from '@netlify/blobs'

export type UploadSubfolder = 'videos' | 'brand' | 'thumbnails'

export async function saveUploadedFile(
  buffer: Buffer,
  filename: string,
  subfolder: UploadSubfolder
): Promise<string> {
  const store = getStore(subfolder)
  await store.set(filename, buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer)
  return `/api/files/${subfolder}/${filename}`
}

export function getPublicUrl(filename: string, subfolder: UploadSubfolder): string {
  return `/api/files/${subfolder}/${filename}`
}

export async function deleteFile(publicUrl: string): Promise<void> {
  // URL format: /api/files/<subfolder>/<filename>
  const parts = publicUrl.split('/').filter(Boolean)
  if (parts.length >= 4) {
    const store = getStore(parts[2])
    await store.delete(parts[3])
  }
}
