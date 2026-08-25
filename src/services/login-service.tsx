"use server"

import { LoginInterface, ResponseLogin, TokenPair } from "@/types/login";
import { baseApi } from "./base-api";

export async function getTokens(data: LoginInterface): Promise<ResponseLogin>{
    const response = await baseApi.post<ResponseLogin>("/token/login", data)
    return response.data
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair>{
    const response = await baseApi.post<TokenPair>("/token/refresh", { refreshToken })
    return response.data
}

export async function blacklistToken(refreshToken: string): Promise<void>{
    await baseApi.post("/token/logout", { refreshToken })
}