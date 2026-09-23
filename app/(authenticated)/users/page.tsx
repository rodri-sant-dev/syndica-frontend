import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { UsersDashboard } from "@/components/dashboard/users-dashboard"
import { createUser, listUsers, toggleUserStatus } from "@/lib/actions/users"
import { getCurrentUser } from "@/services/users.service"
import { hasUserManagementAccess } from "@/types/user"

export default async function UsersPage() {
  const session = await auth()
  const accessToken = session?.accessToken
  const user = accessToken ? await getCurrentUser(accessToken) : null

  if (!hasUserManagementAccess(user)) {
    redirect("/home")
  }

  if (!accessToken) {
    redirect("/login")
  }

  const initialUsers = await listUsers(accessToken)

  return (
    <UsersDashboard
      initialUsers={initialUsers}
      createUserAction={createUser.bind(null, accessToken)}
      toggleUserAction={toggleUserStatus.bind(null, accessToken)}
    />
  )
}
