import axios from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"

const auth = vi.fn()
const signOut = vi.fn()

vi.mock("@/auth", () => ({
  auth,
  signOut,
}))

const { logout } = await import("@/lib/actions/logout")

describe("logout", () => {
  beforeEach(() => {
    auth.mockReset()
    signOut.mockReset()
    vi.restoreAllMocks()
    process.env.SYNDICA_API_URL = "http://localhost:8080"
  })

  it("invalida o refresh token e encerra a sessão local", async () => {
    auth.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    })
    const post = vi.spyOn(axios, "post").mockResolvedValue({
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    })
    signOut.mockResolvedValue(undefined)

    await expect(logout()).resolves.toEqual({ success: true })

    expect(post).toHaveBeenCalledWith(
      "http://localhost:8080/token/logout/",
      { refreshToken: "refresh-token" },
      { headers: { Authorization: "Bearer access-token" } },
    )
    expect(signOut).toHaveBeenCalledWith({ redirect: false })
  })

  it("encerra a sessão local mesmo quando a API de logout falha", async () => {
    auth.mockResolvedValue({ refreshToken: "refresh-token" })
    vi.spyOn(axios, "post").mockRejectedValue(
      new axios.AxiosError("backend unavailable"),
    )
    signOut.mockResolvedValue(undefined)

    await expect(logout()).resolves.toEqual({ success: true })
    expect(signOut).toHaveBeenCalledWith({ redirect: false })
  })
})
