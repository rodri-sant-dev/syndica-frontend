"use server"

import axios from "axios"

type LoginInput = {
  email: string
  password: string
}

type LoginResponse = {
  success: boolean
  message: string
}

type TokensResponse = {
  accessToken?: string
  refreshToken?: string
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const apiUrl = process.env.SYNDICA_API_URL

  if (!apiUrl) {
    return {
      success: false,
      message: "A URL da API não está configurada.",
    }
  }

  try {
    const { data } = await axios.post<TokensResponse>(
      `${apiUrl.replace(/\/$/, "")}/token/login/`,
      {
        email: input.email,
        password: input.password,
        remember: false,
      },
    )

    if (!data.accessToken || !data.refreshToken) {
      return {
        success: false,
        message: "O backend não retornou os tokens de autenticação.",
      }
    }

    return {
      success: true,
      message: "Usuário logado com sucesso.",
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : undefined

      return {
        success: false,
        message:
          responseMessage ||
          (error.response?.status === 404
            ? "E-mail ou senha incorretos."
            : "Não foi possível realizar o login."),
      }
    }

    return {
      success: false,
      message: "Não foi possível realizar o login.",
    }
  }
}
