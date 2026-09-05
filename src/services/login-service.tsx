"use server";

import { LoginInterface, ResponseLogin, TokenPair } from "@/types/login";
import { baseApi, createAuthenticatedRequest } from "./base-api";

export async function getTokens(data: LoginInterface): Promise<ResponseLogin> {
    const response = await baseApi.post<ResponseLogin>("/token/login", data);
    return response.data;
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
    const response = await baseApi.post<TokenPair>("/token/refresh", {
        refreshToken,
    });
    return response.data;
}

export async function blacklistToken(refreshToken: string): Promise<void> {
    await baseApi.post("/token/logout", { refreshToken });
}

export async function getPerfilPhoto(
    token: string,
    uri: string,
): Promise<string> {
    const response = await createAuthenticatedRequest(token).get(uri, {
        responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"] ?? "image/jpeg";
    const imageBase64 = Buffer.from(response.data).toString("base64");

    return `data:${contentType};base64,${imageBase64}`;
}
