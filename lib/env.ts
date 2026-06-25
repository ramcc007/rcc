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

// TURSO_AUTH_TOKEN required for cloud Turso databases (not needed for local file: URLs)
const tursoUrl = process.env.TURSO_DATABASE_URL ?? 'file:./dev.db'
if (!tursoUrl.startsWith('file:') && !process.env.TURSO_AUTH_TOKEN) {
  missing.push('TURSO_AUTH_TOKEN')
}

// Skip validation during Next.js build — vars are only required at runtime
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

if (!isBuild) {
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  if (ENCRYPTION_KEY && !/^[0-9a-fA-F]{64}$/.test(ENCRYPTION_KEY)) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)')
  }
}

export const env = {
  NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ENCRYPTION_KEY,
  TURSO_DATABASE_URL: tursoUrl,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const
