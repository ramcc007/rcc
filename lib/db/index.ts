import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'
import { CREATE_TABLES } from './migrate'

const DB_PATH = process.env.DATABASE_URL?.replace('file:', '') ?? './dev.db'

const globalForDb = globalThis as unknown as { _db: ReturnType<typeof drizzle> }

function createDb() {
  const sqlite = new Database(path.resolve(process.cwd(), DB_PATH))
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  // Auto-create tables on first connection — idempotent, safe to call every startup
  sqlite.exec(CREATE_TABLES)
  return drizzle(sqlite, { schema })
}

// Always cache in globalThis to prevent multiple connections (dev HMR + prod serverless warm instances)
export const db = globalForDb._db ?? (globalForDb._db = createDb())
