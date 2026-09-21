import { auth } from "@/auth"
import { HomeDashboard } from "@/components/dashboard/home-dashboard"
import { getCurrentUser } from "@/services/users.service"

export default async function HomePage() {
  const session = await auth()
  const user = session?.accessToken
    ? await getCurrentUser(session.accessToken)
    : null

  return <HomeDashboard user={user} />
}
