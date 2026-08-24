"use server"

import { LoginInterface, ResponseLogin } from "@/types/login";
import { baseApi } from "./base-api";

export async function getTokens(data: LoginInterface): Promise<ResponseLogin>{
    const response = await baseApi.post<ResponseLogin>("/token/login", data)
    return response.data
}