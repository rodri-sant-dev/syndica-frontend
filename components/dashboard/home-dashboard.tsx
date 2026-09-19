import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  MessageSquare,
  MoreHorizontal,
  UsersRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const overviewItems = [
  {
    label: "Moradores ativos",
    value: "248",
    detail: "+12 neste mês",
    icon: UsersRound,
    trend: "up",
  },
  {
    label: "Unidades ocupadas",
    value: "86%",
    detail: "103 de 120 unidades",
    icon: Building2,
  },
  {
    label: "Arrecadação do mês",
    value: "R$ 42.580",
    detail: "92% do previsto",
    icon: CircleDollarSign,
    trend: "up",
  },
]

const requests = [
  { title: "Manutenção no elevador", unit: "Apto 604", status: "Em análise" },
  { title: "Lâmpada da garagem", unit: "Apto 201", status: "Pendente" },
  { title: "Dúvida sobre taxa", unit: "Apto 410", status: "Respondida" },
]

const chartItems = [
  { month: "Abr", value: "56%", height: "56%" },
  { month: "Mai", value: "68%", height: "68%" },
  { month: "Jun", value: "61%", height: "61%" },
  { month: "Jul", value: "78%", height: "78%" },
  { month: "Ago", value: "84%", height: "84%" },
  { month: "Set", value: "92%", height: "92%" },
]

export function HomeDashboard() {
  return (
    <section className="min-h-svh min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div className="flex w-full flex-col gap-8">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Sexta-feira, 18 de setembro de 2026
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Bom dia, Ana.
            </h1>
            <p className="text-sm text-muted-foreground">
              Aqui está o resumo do Residencial Aurora.
            </p>
          </div>
          <Button type="button" className="w-fit">
            <MessageSquare aria-hidden="true" data-icon="inline-start" />
            Novo comunicado
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {overviewItems.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.label}
                className="flex flex-col gap-6 rounded-2xl border bg-background p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                    <Icon aria-hidden="true" />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-semibold tracking-tight">
                      {item.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.detail}
                    </span>
                  </div>
                  {item.trend ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <ArrowUpRight aria-hidden="true" />
                      Crescendo
                    </span>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="flex flex-col gap-6 rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">Acompanhe a arrecadação</h2>
                <p className="text-sm text-muted-foreground">
                  Percentual recebido nos últimos meses
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Mais opções"
              >
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </div>
            <div className="flex h-56 items-end gap-3 border-b px-2 sm:gap-5">
              {chartItems.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.value}
                  </span>
                  <div
                    className="w-full max-w-10 rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                    style={{ height: item.height }}
                  />
                  <span className="translate-y-5 text-xs text-muted-foreground">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6 rounded-2xl border bg-primary p-5 text-primary-foreground shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">Próxima reserva</h2>
                <p className="text-sm text-primary-foreground/65">
                  Salão de festas
                </p>
              </div>
              <CalendarDays aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">Hoje, 19:00</span>
              <span className="text-sm text-primary-foreground/65">
                Mariana Costa · Apto 302
              </span>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-auto w-full"
            >
              Ver reservas
              <ChevronRight aria-hidden="true" data-icon="inline-end" />
            </Button>
          </section>
        </div>

        <section className="flex flex-col gap-5 rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">Solicitações recentes</h2>
              <p className="text-sm text-muted-foreground">
                Acompanhe os pedidos dos moradores
              </p>
            </div>
            <Button
              type="button"
              variant="link"
              className="hidden sm:inline-flex"
            >
              Ver todas
              <ChevronRight aria-hidden="true" data-icon="inline-end" />
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {requests.map((request) => (
              <article
                key={request.title}
                className="flex flex-col gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <ClipboardList
                    aria-hidden="true"
                    className="text-muted-foreground"
                  />
                  <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                    {request.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{request.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {request.unit} · atualizado ontem
                  </span>
                </div>
              </article>
            ))}
          </div>
          <Button
            type="button"
            variant="link"
            className="self-start px-0 sm:hidden"
          >
            Ver todas
            <ChevronRight aria-hidden="true" data-icon="inline-end" />
          </Button>
        </section>

        <section className="flex items-center gap-4 rounded-2xl border bg-background p-4 shadow-sm sm:p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Bell aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-sm font-medium">Assembleia ordinária agendada</p>
            <p className="truncate text-xs text-muted-foreground">
              24 de setembro, às 19h · Salão de festas
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Ver detalhes
          </Button>
        </section>
      </div>
    </section>
  )
}
