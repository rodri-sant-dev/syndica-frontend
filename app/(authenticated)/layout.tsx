import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout"

export default function AuthenticatedRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
