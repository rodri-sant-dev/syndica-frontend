export const ACCESS_TOKEN_REFRESH_WINDOW_MS = 30 * 1000

export const parseJwtExpiration = (token?: string): number | undefined => {
  if (!token) {
    return undefined
  }

  const [, payload] = token.split(".")

  if (!payload) {
    return undefined
  }

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=")

    const decoded = JSON.parse(
      Buffer.from(normalizedPayload, "base64").toString("utf-8"),
    ) as { exp?: number }

    if (typeof decoded.exp !== "number") {
      return undefined
    }

    return decoded.exp * 1000
  } catch {
    return undefined
  }
}

export const shouldRefreshAccessToken = (
  accessTokenExpiresAt?: number,
  now = Date.now(),
) => {
  if (typeof accessTokenExpiresAt !== "number") {
    return true
  }

  return accessTokenExpiresAt <= now + ACCESS_TOKEN_REFRESH_WINDOW_MS
}
