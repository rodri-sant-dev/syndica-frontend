export type UserProfile = {
  username: string
  email: string
  grupos?: string[]
}

export type UserResponse = {
  id: string
  username: string
  email: string
  active: boolean
}

export type UserRole = "MANAGER" | "SINDICO"

export function hasUserManagementAccess(user?: UserProfile | null) {
  return Boolean(
    user?.grupos?.some(
      (grupo) => grupo.trim().toUpperCase() === "SINDICO",
    ),
  )
}
