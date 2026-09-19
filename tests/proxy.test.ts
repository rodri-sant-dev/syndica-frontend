import { NextRequest } from "next/server"

import { beforeEach, describe, expect, it, vi } from "vitest"

const auth = vi.fn()

vi.mock("@/auth", () => ({
  auth,
}))

const { default: proxyHandler } = await import("@/proxy")
const proxy = proxyHandler as unknown as (request: NextRequest) => Promise<Response>

function createRequest(path: string, authenticated = false) {
  const request = new NextRequest(`http://localhost:3000${path}`)

  Object.defineProperty(request, "auth", {
    configurable: true,
    value: authenticated ? { user: { email: "user@example.com" } } : null,
  })

  return request
}

describe("proxy de autenticação", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("permite o acesso à tela de login sem sessão", async () => {
    auth.mockResolvedValue(null)
    const response = await proxy(createRequest("/login"))

    expect(response.status).toBe(200)
  })

  it("redireciona usuário autenticado de /login para /home", async () => {
    auth.mockResolvedValue({ user: { email: "user@example.com" } })
    const response = await proxy(createRequest("/login?returnTo=%2Fcontas"))

    expect(response.headers.get("location")).toBe("http://localhost:3000/home")
  })

  it("redireciona qualquer rota protegida preservando caminho e query", async () => {
    auth.mockResolvedValue(null)
    const response = await proxy(createRequest("/contas?status=aberta"))

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?returnTo=%2Fcontas%3Fstatus%3Daberta",
    )
  })

  it("permite qualquer rota protegida quando há sessão", async () => {
    auth.mockResolvedValue({ user: { email: "user@example.com" } })
    const response = await proxy(createRequest("/contas?status=aberta"))

    expect(response.status).toBe(200)
  })
})
