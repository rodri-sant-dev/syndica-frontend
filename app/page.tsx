import { Building2, Check, ChevronRight, LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="min-h-svh bg-muted/40 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100svh-2.5rem)] max-w-7xl overflow-hidden rounded-3xl border bg-background shadow-xl shadow-foreground/5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-40 -top-40 size-[30rem] rounded-full border border-primary-foreground/10" />
          <div className="absolute -bottom-52 -left-52 size-[34rem] rounded-full border border-primary-foreground/10" />
          <div className="absolute right-24 top-1/2 size-24 rounded-full border border-primary-foreground/10" />

          <div className="relative flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground text-primary">
              <Building2 aria-hidden="true" />
            </div>
            <span className="text-xl font-semibold tracking-tight">syndica</span>
          </div>

          <div className="relative flex max-w-lg flex-col gap-8">
            <div className="flex size-12 items-center justify-center rounded-xl border border-primary-foreground/15 bg-primary-foreground/10">
              <LockKeyhole aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary-foreground/60">
                Gestão condominial
              </p>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                Tudo do seu condomínio em um só lugar.
              </h2>
              <p className="max-w-md text-base leading-7 text-primary-foreground/70">
                Comunicação, finanças, reservas e solicitações organizadas para
                síndicos e moradores.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3">
                <Check aria-hidden="true" className="text-primary-foreground" />
                <span>Mais praticidade para a administração</span>
              </div>
              <div className="flex items-center gap-3">
                <Check aria-hidden="true" className="text-primary-foreground" />
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
                  <Building2 aria-hidden="true" />
                </div>
                <span className="font-semibold tracking-tight">syndica</span>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Acesse o seu condomínio
                </h1>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Entre para acompanhar tudo o que acontece na sua comunidade.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
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
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              <Button type="button" size="lg" className="h-12 w-full rounded-xl">
                Entrar na plataforma
                <ChevronRight aria-hidden="true" data-icon="inline-end" />
              </Button>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
                  <Building2 aria-hidden="true" />
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
              Ao continuar, você concorda com os termos de uso e a política de
              privacidade da Syndica.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
