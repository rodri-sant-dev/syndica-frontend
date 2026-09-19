"use server"

import axios from "axios"

import { auth, signOut } from "@/auth"

export async function logout() {
  const session = await auth()
  const apiUrl = process.env.SYNDICA_API_URL

  try {
    if (apiUrl && session?.refreshToken) {
      await axios.post(
        `${apiUrl.replace(/\/$/, "")}/token/logout/`,
        { refreshToken: session.refreshToken },
        {
          headers: session.accessToken
            ? { Authorization: `Bearer ${session.accessToken}` }
            : undefined,
        },
      )
    }
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error
    }
  } finally {
    await signOut({ redirect: false })
  }

  return { success: true }
}
