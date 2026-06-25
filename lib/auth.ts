import NextAuth from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import { authConfig } from '@/auth.config'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

const DrizzleAdapter: Adapter = {
  async createUser(data) {
    const id = uuidv4()
    await db.insert(users).values({
      id,
      email: data.email,
      name: data.name ?? null,
      image: data.image ?? null,
      emailVerified: data.emailVerified ?? null,
    })
    const user = await db.select().from(users).where(eq(users.id, id)).get()
    return { ...user!, emailVerified: user!.emailVerified }
  },

  async getUser(id) {
    const user = await db.select().from(users).where(eq(users.id, id)).get()
    if (!user) return null
    return { ...user, emailVerified: user.emailVerified }
  },

  async getUserByEmail(email) {
    const user = await db.select().from(users).where(eq(users.email, email)).get()
    if (!user) return null
    return { ...user, emailVerified: user.emailVerified }
  },

  async getUserByAccount({ provider, providerAccountId }) {
    const result = await db
      .select({ user: users })
      .from(accounts)
      .innerJoin(users, eq(accounts.userId, users.id))
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId)
        )
      )
      .get()
    if (!result) return null
    return { ...result.user, emailVerified: result.user.emailVerified }
  },

  async updateUser(data) {
    const { id, ...updateData } = data
    await db.update(users).set({
      name: updateData.name ?? undefined,
      image: updateData.image ?? undefined,
      emailVerified: updateData.emailVerified ?? undefined,
    }).where(eq(users.id, id))
    const user = await db.select().from(users).where(eq(users.id, id)).get()
    return { ...user!, emailVerified: user!.emailVerified }
  },

  async linkAccount(data) {
    await db.insert(accounts).values({
      id: uuidv4(),
      userId: data.userId,
      type: data.type,
      provider: data.provider,
      providerAccountId: data.providerAccountId,
      refreshToken: (data.refresh_token as string) ?? null,
      accessToken: (data.access_token as string) ?? null,
      expiresAt: data.expires_at != null ? Number(data.expires_at) : null,
      tokenType: (data.token_type as string) ?? null,
      scope: (data.scope as string) ?? null,
      idToken: (data.id_token as string) ?? null,
      sessionState: (data.session_state as string) ?? null,
    })
    return data
  },

  async createSession(data) {
    const id = uuidv4()
    await db.insert(sessions).values({
      id,
      sessionToken: data.sessionToken,
      userId: data.userId,
      expires: data.expires,
    })
    const session = await db.select().from(sessions).where(eq(sessions.id, id)).get()
    return session!
  },

  async getSessionAndUser(sessionToken) {
    const result = await db
      .select({ session: sessions, user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.sessionToken, sessionToken))
      .get()
    if (!result) return null
    return {
      session: result.session,
      user: { ...result.user, emailVerified: result.user.emailVerified },
    }
  },

  async updateSession(data) {
    await db
      .update(sessions)
      .set({ expires: data.expires ?? undefined })
      .where(eq(sessions.sessionToken, data.sessionToken))
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, data.sessionToken))
      .get()
    return session ?? null
  },

  async deleteSession(sessionToken) {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
  },

  async createVerificationToken(data) {
    await db.insert(verificationTokens).values({
      identifier: data.identifier,
      token: data.token,
      expires: data.expires,
    })
    return data
  },

  async useVerificationToken({ identifier, token }) {
    const vt = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token)
        )
      )
      .get()
    if (!vt) return null
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token)
        )
      )
    return vt
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter,
})
