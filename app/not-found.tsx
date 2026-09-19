import Link from "next/link"
import { Building2, Home } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-8">
      <Empty className="max-w-lg rounded-2xl border bg-background shadow-sm sm:p-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Itens não encontrados</EmptyTitle>
          <EmptyDescription>
            Não encontramos a página ou os itens que você tentou acessar.
            Verifique o endereço ou volte para a página inicial.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/home" />}>
            <Home aria-hidden="true" data-icon="inline-start" />
            Ir para a página inicial
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
