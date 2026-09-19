import { NextRequest } from "next/server"

import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/auth", () => ({
  auth: (handler: (request: NextRequest) => Response) => handler,
}))

const { default: proxyHandler } = await import("@/proxy")
const proxy = proxyHandler as unknown as (request: NextRequest) => Response

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

  it("permite o acesso à tela de login sem sessão", () => {
    const response = proxy(createRequest("/login"))

    expect(response.status).toBe(200)
  })

  it("redireciona usuário autenticado de /login para /home", () => {
    const response = proxy(createRequest("/login?returnTo=%2Fcontas", true))

    expect(response.headers.get("location")).toBe("http://localhost:3000/home")
  })

  it("redireciona qualquer rota protegida preservando caminho e query", () => {
    const response = proxy(createRequest("/contas?status=aberta"))

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?returnTo=%2Fcontas%3Fstatus%3Daberta",
    )
  })

  it("permite qualquer rota protegida quando há sessão", () => {
    const response = proxy(createRequest("/contas?status=aberta", true))

    expect(response.status).toBe(200)
  })
})
