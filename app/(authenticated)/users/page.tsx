import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { UsersDashboard } from "@/components/dashboard/users-dashboard"
import { getCurrentUser } from "@/services/users.service"
import { hasUserManagementAccess } from "@/types/user"

export default async function UsersPage() {
  const session = await auth()
  const user = session?.accessToken
    ? await getCurrentUser(session.accessToken)
    : null

  if (!hasUserManagementAccess(user)) {
    redirect("/home")
  }

  return <UsersDashboard />
}
