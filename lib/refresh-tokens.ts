import axios from "axios"

type TokensResponse = {
  accessToken?: string
  refreshToken?: string
}

const pendingRefreshes = new Map<string, Promise<TokensResponse>>()

export function refreshTokens(
  refreshUrl: string,
  refreshToken: string,
): Promise<TokensResponse> {
  const pendingRefresh = pendingRefreshes.get(refreshToken)

  if (pendingRefresh) {
    return pendingRefresh
  }

  const request = axios
    .post<TokensResponse>(refreshUrl, { refreshToken })
    .then(({ data }) => data)
    .finally(() => {
      pendingRefreshes.delete(refreshToken)
    })

  pendingRefreshes.set(refreshToken, request)
  return request
}
