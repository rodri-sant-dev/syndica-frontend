"use server"

import axios from "axios"

import { api } from "@/lib/api"

export type UserManagementRecord = {
  id: string
  username: string
  email: string
  active: boolean
  grupos?: string[]
}

export type CreateUserPayload = {
  username: string
  email: string
  password: string
}

function getAuthHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

function extractErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const responseData = error.response?.data

    if (status && status >= 500) {
      return "Something went wrong while processing your request. Please try again in a moment."
    }

    const rawMessage =
      (typeof responseData === "string" && responseData.trim()) ||
      (typeof (responseData as { message?: string })?.message === "string"
        ? (responseData as { message: string }).message
        : "") ||
      (typeof (responseData as { error?: string })?.error === "string"
        ? (responseData as { error: string }).error
        : "") ||
      error.message ||
      fallback

    return rawMessage || fallback
  }

  if (error instanceof Error && error.message) {
    const statusLike = (error as Error & { status?: number }).status
    if (statusLike && statusLike >= 500) {
      return "Something went wrong while processing your request. Please try again in a moment."
    }

    return error.message
  }

  return fallback
}

export async function listUsers(accessToken: string) {
  try {
    const { data } = await api.get<UserManagementRecord[]>("/users", {
      headers: getAuthHeaders(accessToken),
    })

    return data
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Não foi possível carregar os usuários."),
    )
  }
}

export async function createUser(accessToken: string, payload: CreateUserPayload) {
  try {
    const { data } = await api.post<UserManagementRecord>("/users", payload, {
      headers: getAuthHeaders(accessToken),
    })

    return data
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Não foi possível cadastrar o usuário."),
    )
  }
}

export async function toggleUserStatus(
  accessToken: string,
  userId: string,
  active: boolean,
) {
  try {
    const { data } = await api.patch<UserManagementRecord>(
      `/users/${userId}/${active ? "activate" : "deactivate"}`,
      undefined,
      {
        headers: getAuthHeaders(accessToken),
      },
    )

    return data
  } catch (error) {
    throw new Error(
      extractErrorMessage(
        error,
        active ? "Não foi possível ativar o usuário." : "Não foi possível inativar o usuário.",
      ),
    )
  }
}
