import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout"
import { auth } from "@/auth"
import { getCurrentUser } from "@/services/users.service"

export default async function AuthenticatedRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.accessToken
    ? await getCurrentUser(session.accessToken)
    : null

  return <AuthenticatedLayout user={user}>{children}</AuthenticatedLayout>
}
