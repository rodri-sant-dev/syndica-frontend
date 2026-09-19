import { describe, expect, it } from "vitest"

import {
  parseJwtExpiration,
  shouldRefreshAccessToken,
} from "@/lib/auth-tokens"

const toBase64Url = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")

const createJwt = (expInSecondsFromNow: number) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + expInSecondsFromNow,
  }

  return `${toBase64Url("header")}.${toBase64Url(JSON.stringify(payload))}.signature`
}

describe("auth token expiration parsing", () => {
  it("extrai exp do payload do JWT e não gera o tempo no frontend", () => {
    const expInSecondsFromNow = 120
    const jwt = createJwt(expInSecondsFromNow)
    const parsed = parseJwtExpiration(jwt)

    expect(parsed).toBeDefined()
    expect(parsed).toBeGreaterThan(Date.now())
    expect(parsed).toBeLessThanOrEqual(
      Date.now() + expInSecondsFromNow * 1000 + 1000,
    )
  })

  it("faz refresh quando o token expira em até 30s", () => {
    const now = 1_700_000_000_000
    expect(shouldRefreshAccessToken(now + 29_000, now)).toBe(true)
    expect(shouldRefreshAccessToken(now + 31_000, now)).toBe(false)
  })

  it("retorna undefined para jwt inválido", () => {
    expect(parseJwtExpiration("token-invalido")).toBeUndefined()
    expect(parseJwtExpiration(undefined)).toBeUndefined()
  })
})
