import axios from "axios"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

type TokensResponse = {
  accessToken?: string
  refreshToken?: string
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const apiUrl = process.env.SYNDICA_API_URL
        const email =
          typeof credentials?.email === "string" ? credentials.email : ""
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : ""

        if (!apiUrl || !email || !password) {
          return null
        }

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
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined
      session.refreshToken =
        typeof token.refreshToken === "string" ? token.refreshToken : undefined
      return session
    },
  },
})
