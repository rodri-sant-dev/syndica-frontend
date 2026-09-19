import { beforeEach, describe, expect, it, vi } from "vitest"

const mockAxiosClient = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockAxiosClient),
    isAxiosError: (error: unknown) => Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
  },
}))

import { loginAction } from "./auth"

describe("loginAction", () => {
  beforeEach(() => {
    mockAxiosClient.post.mockReset()
    vi.spyOn(console, "log").mockImplementation(() => undefined)
  })

  it("returns success and logs a clear message when login succeeds", async () => {
    mockAxiosClient.post.mockResolvedValue({ status: 200, data: { accessToken: "token" } })

    const result = await loginAction({ email: "admin@syndica.com", password: "secret123" })

    expect(mockAxiosClient.post).toHaveBeenCalledWith("/token/login/", {
      email: "admin@syndica.com",
      password: "secret123",
    })
    expect(result).toEqual({
      success: true,
      message: "Login realizado com sucesso.",
    })
    expect(console.log).toHaveBeenCalledWith("Login concluído com sucesso.")
  })

  it("returns a clear error for invalid credentials", async () => {
    mockAxiosClient.post.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: "Invalid credentials" } },
    })

    const result = await loginAction({ email: "admin@syndica.com", password: "wrong" })

    expect(result).toEqual({
      success: false,
      message: "E-mail ou senha inválidos.",
    })
  })

  it("returns a clear error when the backend is unavailable", async () => {
    mockAxiosClient.post.mockRejectedValue({
      isAxiosError: true,
      code: "ERR_NETWORK",
    })

    const result = await loginAction({ email: "admin@syndica.com", password: "secret123" })

    expect(result).toEqual({
      success: false,
      message: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
    })
  })
})
