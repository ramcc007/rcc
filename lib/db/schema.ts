import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: integer('email_verified', { mode: 'timestamp' }),
  encryptedGeminiKey: text('encrypted_gemini_key'),
  defaultPlatform: text('default_platform').default('tiktok'),
  defaultAspectRatio: text('default_aspect_ratio').default('9:16'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
})

export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
})

export const brandKits = sqliteTable('brand_kits', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  primaryColor: text('primary_color'),
  secondaryColor: text('secondary_color'),
  logoUrl: text('logo_url'),
  watermarkUrl: text('watermark_url'),
  fontFamily: text('font_family'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const brandAssets = sqliteTable('brand_assets', {
  id: text('id').primaryKey(),
  brandKitId: text('brand_kit_id').notNull().references(() => brandKits.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // product_image | logo | watermark
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  brandKitId: text('brand_kit_id').references(() => brandKits.id),
  name: text('name').notNull(),
  productName: text('product_name').notNull(),
  productCategory: text('product_category').notNull(),
  targetAudience: text('target_audience').notNull(),
  brandVoice: text('brand_voice'),
  competitorNames: text('competitor_names'), // JSON array string
  status: text('status').default('draft').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const scripts = sqliteTable('scripts', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  hookType: text('hook_type').notNull(),
  funnelStage: text('funnel_stage').notNull(),
  ctaType: text('cta_type').notNull(),
  tone: text('tone').notNull(),
  platform: text('platform').notNull(),
  duration: integer('duration').notNull(), // seconds
  persona: text('persona').notNull(),
  content: text('content').notNull(), // JSON string
  version: integer('version').default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const videoJobs = sqliteTable('video_jobs', {
  id: text('id').primaryKey(),
  scriptId: text('script_id').notNull().references(() => scripts.id, { onDelete: 'cascade' }),
  aspectRatio: text('aspect_ratio').notNull(),
  resolution: text('resolution').default('1080p').notNull(),
  characterDesc: text('character_desc'), // JSON string
  referenceImageUrls: text('reference_image_urls'), // JSON array string
  veoJobId: text('veo_job_id'),
  veoOperationName: text('veo_operation_name'),
  status: text('status').default('queued').notNull(),
  outputUrl: text('output_url'),
  thumbnailUrl: text('thumbnail_url'),
  durationActual: real('duration_actual'),
  fileSizeBytes: integer('file_size_bytes'),
  qualityScore: real('quality_score'),
  qualityReport: text('quality_report'), // JSON string
  complianceScore: real('compliance_score'),
  complianceReport: text('compliance_report'), // JSON string
  errorMessage: text('error_message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const videoExports = sqliteTable('video_exports', {
  id: text('id').primaryKey(),
  videoJobId: text('video_job_id').notNull().references(() => videoJobs.id, { onDelete: 'cascade' }),
  format: text('format').notNull(),
  resolution: text('resolution').notNull(),
  platform: text('platform'),
  withOverlays: integer('with_overlays', { mode: 'boolean' }).default(true),
  exportedUrl: text('exported_url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})
