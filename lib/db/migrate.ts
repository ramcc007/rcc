import { createClient } from '@libsql/client'

export const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  image TEXT,
  email_verified INTEGER,
  encrypted_gemini_key TEXT,
  encrypted_fal_key TEXT,
  default_platform TEXT DEFAULT 'tiktok',
  default_aspect_ratio TEXT DEFAULT '9:16',
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires INTEGER NOT NULL,
  UNIQUE(identifier, token)
);

CREATE TABLE IF NOT EXISTS brand_kits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_color TEXT,
  secondary_color TEXT,
  logo_url TEXT,
  watermark_url TEXT,
  font_family TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS brand_assets (
  id TEXT PRIMARY KEY,
  brand_kit_id TEXT NOT NULL REFERENCES brand_kits(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_kit_id TEXT REFERENCES brand_kits(id),
  name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  brand_voice TEXT,
  competitor_names TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS scripts (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  hook_type TEXT NOT NULL,
  funnel_stage TEXT NOT NULL,
  cta_type TEXT NOT NULL,
  tone TEXT NOT NULL,
  platform TEXT NOT NULL,
  duration INTEGER NOT NULL,
  persona TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS video_jobs (
  id TEXT PRIMARY KEY,
  script_id TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  aspect_ratio TEXT NOT NULL,
  resolution TEXT NOT NULL DEFAULT '1080p',
  character_desc TEXT,
  reference_image_urls TEXT,
  veo_job_id TEXT,
  veo_operation_name TEXT,
  provider TEXT NOT NULL DEFAULT 'veo',
  fal_request_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  output_url TEXT,
  thumbnail_url TEXT,
  duration_actual REAL,
  file_size_bytes INTEGER,
  quality_score REAL,
  quality_report TEXT,
  compliance_score REAL,
  compliance_report TEXT,
  error_message TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS video_exports (
  id TEXT PRIMARY KEY,
  video_job_id TEXT NOT NULL REFERENCES video_jobs(id) ON DELETE CASCADE,
  format TEXT NOT NULL,
  resolution TEXT NOT NULL,
  platform TEXT,
  with_overlays INTEGER DEFAULT 1,
  exported_url TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS rate_limit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_key_ts ON rate_limit_log (key, ts);
`

// Incremental column additions — safe to re-run; errors are ignored
const ALTER_MIGRATIONS = [
  `ALTER TABLE users ADD COLUMN encrypted_fal_key TEXT`,
  `ALTER TABLE video_jobs ADD COLUMN provider TEXT NOT NULL DEFAULT 'veo'`,
  `ALTER TABLE video_jobs ADD COLUMN fal_request_id TEXT`,
]

export async function runMigrations() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL ?? 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  const statements = CREATE_TABLES.split(';').map(s => s.trim()).filter(Boolean)
  for (const sql of statements) {
    await client.execute(sql)
  }

  for (const sql of ALTER_MIGRATIONS) {
    try {
      await client.execute(sql)
    } catch {
      // Column already exists — safe to ignore
    }
  }

  client.close()
  console.log('Database migrations completed')
}

if (require.main === module) {
  runMigrations().catch(console.error)
}
