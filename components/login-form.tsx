"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { loginAction, type LoginFormValues } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setApiError(null)
    setSuccessMessage(null)

    const result = await loginAction(values)

    if (!result.success) {
      setApiError(result.message)
      return
    }

    setSuccessMessage(result.message)
  }

  return (
    <main className="min-h-svh bg-muted/40 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100svh-2.5rem)] max-w-7xl overflow-hidden rounded-3xl border bg-background shadow-xl shadow-foreground/5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-40 -top-40 size-[30rem] rounded-full border border-primary-foreground/10" />
          <div className="absolute -bottom-52 -left-52 size-[34rem] rounded-full border border-primary-foreground/10" />
          <div className="absolute right-24 top-1/2 size-24 rounded-full border border-primary-foreground/10" />

          <div className="relative flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground text-primary">
              <Building2Icon />
            </div>
            <span className="text-xl font-semibold tracking-tight">syndica</span>
          </div>

          <div className="relative flex max-w-lg flex-col gap-8">
            <div className="flex size-12 items-center justify-center rounded-xl border border-primary-foreground/15 bg-primary-foreground/10">
              <LockIcon />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary-foreground/60">
                Gestão condominial
              </p>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                Tudo do seu condomínio em um só lugar.
              </h2>
              <p className="max-w-md text-base leading-7 text-primary-foreground/70">
                Comunicação, finanças, reservas e solicitações organizadas para síndicos e moradores.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3">
                <CheckIcon />
                <span>Mais praticidade para a administração</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckIcon />
                <span>Mais transparência para todos</span>
              </div>
            </div>
          </div>

          <p className="relative text-xs text-primary-foreground/50">
            Gestão simples para uma convivência melhor.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16">
          <div className="flex w-full max-w-md flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2Icon />
                </div>
                <span className="font-semibold tracking-tight">syndica</span>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">Acesse o seu condomínio</h1>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Entre para acompanhar tudo o que acontece na sua comunidade.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...register("email", {
                    required: "E-mail é obrigatório.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Informe um e-mail válido.",
                    },
                  })}
                />
                {errors.email ? (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Recuperar acesso
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...register("password", {
                    required: "Senha é obrigatória.",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres.",
                    },
                  })}
                />
                {errors.password ? (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              {apiError ? (
                <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                  {apiError}
                </div>
              ) : null}

              {successMessage ? (
                <div role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <Button type="submit" size="lg" className="h-12 w-full rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar na plataforma"}
                <ChevronRight aria-hidden="true" data-icon="inline-end" />
              </Button>
            </form>

            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
                  <Building2Icon />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Primeiro acesso?</p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Use o convite enviado pela administração do seu condomínio.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs leading-5 text-muted-foreground">
              Ao continuar, você concorda com os termos de uso e a política de privacidade da Syndica.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

function Building2Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
      <path d="M4 20V7.5A1.5 1.5 0 0 1 5.5 6H9l2-2h2l2 2h3.5A1.5 1.5 0 0 1 20 7.5V20" />
      <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 text-current">
      <path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
