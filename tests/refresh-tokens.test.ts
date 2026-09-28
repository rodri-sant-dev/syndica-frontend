import axios from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { refreshTokens } from "@/lib/refresh-tokens"

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}))

describe("refresh token requests", () => {
  beforeEach(() => {
    vi.mocked(axios.post).mockReset()
  })

  it("shares a pending refresh request for the same refresh token", async () => {
    let resolveRequest!: (response: {
      data: { accessToken: string; refreshToken: string }
    }) => void
    vi.mocked(axios.post).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      }),
    )

    const firstRequest = refreshTokens(
      "http://localhost:8080/token/refresh/",
      "refresh-token",
    )
    const secondRequest = refreshTokens(
      "http://localhost:8080/token/refresh/",
      "refresh-token",
    )

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/token/refresh/",
      { refreshToken: "refresh-token" },
    )

    resolveRequest({
      data: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      },
    })

    await expect(firstRequest).resolves.toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    })
    await expect(secondRequest).resolves.toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    })
  })

  it("allows a new refresh attempt after a failed request", async () => {
    vi.mocked(axios.post)
      .mockRejectedValueOnce(new Error("temporary failure"))
      .mockResolvedValueOnce({
        data: { accessToken: "new-access-token", refreshToken: "new-refresh-token" },
      })

    await expect(
      refreshTokens("http://localhost:8080/token/refresh/", "refresh-token"),
    ).rejects.toThrow("temporary failure")
    await expect(
      refreshTokens("http://localhost:8080/token/refresh/", "refresh-token"),
    ).resolves.toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    })
    expect(axios.post).toHaveBeenCalledTimes(2)
  })
})
