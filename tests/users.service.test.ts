import axios from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { api } from "@/lib/api"
import { getCurrentUser } from "@/services/users.service"

vi.mock("axios", () => ({
  default: {
    isAxiosError: vi.fn(() => true),
  },
}))

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
  },
}))

describe("users service", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
  })

  it("loads the authenticated user and sends the bearer token", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        username: "Mariana",
        email: "mariana@example.com",
        grupos: ["MORADOR", "SINDICO"],
      },
    })

    await expect(getCurrentUser("access-token")).resolves.toEqual(
      expect.objectContaining({ username: "Mariana" }),
    )
    expect(api.get).toHaveBeenCalledWith(
      "/users/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer access-token" },
      }),
    )
  })

  it("keeps the rest of the home available when the profile is unavailable", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("network"))
    vi.mocked(axios.isAxiosError).mockReturnValue(true)

    await expect(getCurrentUser("access-token")).resolves.toBeNull()
  })
})
