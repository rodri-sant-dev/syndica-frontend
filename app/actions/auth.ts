"use server"

import axios from "axios"

export type LoginFormValues = {
  email: string
  password: string
}

export type LoginActionState = {
  success: boolean
  message: string
}

const backendBaseUrl =
  process.env.SYNDICA_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const axiosClient = axios.create({
  baseURL: backendBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function loginAction(values: LoginFormValues): Promise<LoginActionState> {
  const email = values.email.trim()
  const password = values.password

  if (!email || !password) {
    return {
      success: false,
      message: "Informe seu e-mail e senha.",
    }
  }

  try {
    await axiosClient.post("/token/login/", {
      email,
      password,
    })

    console.log("Login concluído com sucesso.")

    return {
      success: true,
      message: "Login realizado com sucesso.",
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getLoginErrorMessage(error),
    }
  }
}

function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message ??
          error.response?.data?.error ??
          error.response?.data?.detail

    if (error.response?.status === 401) {
      return "E-mail ou senha inválidos."
    }

    if (error.code === "ERR_NETWORK") {
      return "Não foi possível conectar ao servidor. Tente novamente mais tarde."
    }

    if (typeof responseMessage === "string" && responseMessage.trim().length > 0) {
      return responseMessage
    }

    return "Não foi possível concluir o login. Tente novamente."
  }

  return "Não foi possível concluir o login. Tente novamente."
}
