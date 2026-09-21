import axios from "axios"

import { api } from "@/lib/api"
import type { UserProfile } from "@/types/user"

export async function getCurrentUser(
  accessToken: string,
): Promise<UserProfile | null> {
  if (!accessToken) {
    return null
  }

  try {
    const { data } = await api.get<UserProfile>("/users/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return null
    }

    throw error
  }
}
