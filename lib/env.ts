const missing: string[] = []

function required(name: string): string {
  const val = process.env[name]
  if (!val) missing.push(name)
  return val ?? ''
}

const NEXTAUTH_SECRET = required('NEXTAUTH_SECRET')
const GOOGLE_CLIENT_ID = required('GOOGLE_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = required('GOOGLE_CLIENT_SECRET')
const ENCRYPTION_KEY = required('ENCRYPTION_KEY')

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

// ENCRYPTION_KEY must be 64 hex chars (32 bytes for AES-256)
if (!/^[0-9a-fA-F]{64}$/.test(ENCRYPTION_KEY)) {
  throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)')
}

export const env = {
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ENCRYPTION_KEY,
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const
