import { LoginForm } from "@/components/forms/login-form"

type LoginPageProps = {
  searchParams: Promise<{
    returnTo?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { returnTo } = await searchParams

  return <LoginForm returnTo={returnTo} />
}
