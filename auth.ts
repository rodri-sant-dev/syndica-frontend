import axios from "axios"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import {
  parseJwtExpiration,
  shouldRefreshAccessToken,
} from "@/lib/auth-tokens"
import { refreshTokens } from "@/lib/refresh-tokens"

type TokensResponse = {
  accessToken?: string
  refreshToken?: string
}

type ExpirableToken = {
  accessToken?: string
  refreshToken?: string
  accessTokenExpiresAt?: number
  refreshTokenExpiresAt?: number
  shouldLogout?: boolean
}

const nextAuth = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const apiUrl = process.env.SYNDICA_API_URL
        const email = typeof credentials?.email === "string" ? credentials.email : ""
        const password = typeof credentials?.password === "string" ? credentials.password : ""

        if (!apiUrl || !email || !password) { return null }

        try {
          const { data } = await axios.post<TokensResponse>(
            `${apiUrl.replace(/\/$/, "")}/token/login/`,
            {
              email,
              password,
              remember: false,
            },
          )

          if (!data.accessToken || !data.refreshToken) {
            return null
          }

          return {
            id: data.accessToken,
            email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return null
          }

          throw error
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      const jwtToken = token as ExpirableToken

      if (user) {
        jwtToken.accessToken = user.accessToken
        jwtToken.refreshToken = user.refreshToken
        jwtToken.accessTokenExpiresAt = parseJwtExpiration(user.accessToken)
        jwtToken.refreshTokenExpiresAt = parseJwtExpiration(user.refreshToken)
        jwtToken.shouldLogout = false
        return jwtToken
      }

      if (!jwtToken.accessToken || !jwtToken.refreshToken) {
        return jwtToken
      }

      const accessTokenExpiresAt =
        jwtToken.accessTokenExpiresAt ??
        parseJwtExpiration(jwtToken.accessToken)

      if (!shouldRefreshAccessToken(accessTokenExpiresAt)) {
        return jwtToken
      }

      try {
        const apiUrl = process.env.SYNDICA_API_URL

        if (!apiUrl) {
          return {
            ...jwtToken,
            accessToken: undefined,
            refreshToken: undefined,
            accessTokenExpiresAt: undefined,
            refreshTokenExpiresAt: undefined,
            shouldLogout: true,
          }
        }

        const data = await refreshTokens(
          `${apiUrl.replace(/\/$/, "")}/token/refresh/`,
          jwtToken.refreshToken,
        )

        if (!data.accessToken || !data.refreshToken) {
          return {
            ...jwtToken,
            accessToken: undefined,
            refreshToken: undefined,
            accessTokenExpiresAt: undefined,
            refreshTokenExpiresAt: undefined,
            shouldLogout: true,
          }
        }

        jwtToken.accessToken = data.accessToken
        jwtToken.refreshToken = data.refreshToken
        jwtToken.accessTokenExpiresAt = parseJwtExpiration(data.accessToken)
        jwtToken.refreshTokenExpiresAt = parseJwtExpiration(data.refreshToken)
        jwtToken.shouldLogout = false

        return jwtToken
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            ...jwtToken,
            accessToken: undefined,
            refreshToken: undefined,
            accessTokenExpiresAt: undefined,
            refreshTokenExpiresAt: undefined,
            shouldLogout: true,
          }
        }

        throw error
      }
    },
    async session({ session, token }) {
      const jwtToken = token as ExpirableToken

      if (jwtToken.shouldLogout) {
        return {
          ...session,
          accessToken: undefined,
          refreshToken: undefined,
          accessTokenExpiresAt: undefined,
          refreshTokenExpiresAt: undefined,
          shouldLogout: true,
        }
      }

      session.accessToken = typeof jwtToken.accessToken === "string" ? jwtToken.accessToken : undefined
      session.refreshToken = typeof jwtToken.refreshToken === "string" ? jwtToken.refreshToken : undefined
      session.accessTokenExpiresAt = typeof jwtToken.accessTokenExpiresAt === "number" ? jwtToken.accessTokenExpiresAt : undefined
      session.refreshTokenExpiresAt = typeof jwtToken.refreshTokenExpiresAt === "number" ? jwtToken.refreshTokenExpiresAt : undefined

      return session
    },
  },
})

export const { handlers, signIn, signOut } = nextAuth

const nextAuthSession = nextAuth.auth as (...args: any[]) => Promise<any>

export const auth = (async (...args: any[]) => {
  if (typeof args[0] === "function") {
    return nextAuthSession(...args)
  }

  const session = await nextAuthSession(...args)

  if (session && "shouldLogout" in session && session.shouldLogout) {
    // await signOut({ redirect: false })
    return null
  }

  return session
}) as typeof nextAuth.auth
