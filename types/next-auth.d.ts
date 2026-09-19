import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
    refreshTokenExpiresAt?: number
    shouldLogout?: boolean
    user: DefaultSession["user"]
  }

  interface User {
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
    refreshTokenExpiresAt?: number
    shouldLogout?: boolean
  }
}

declare module "next/server" {
  interface NextRequest {
    auth?: Session | null
  }
}
