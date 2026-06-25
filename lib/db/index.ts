import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const globalForDb = globalThis as unknown as { _db: ReturnType<typeof drizzle> }

function createDb() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL ?? 'file:./dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  return drizzle(client, { schema })
}

// Cache in globalThis to prevent multiple connections (dev HMR + prod warm instances)
export const db = globalForDb._db ?? (globalForDb._db = createDb())
