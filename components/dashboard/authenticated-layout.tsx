"use client"

import {
  Bell,
  Building2,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Settings,
  UsersRound,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions/logout"
import {
  hasUserManagementAccess,
  type UserProfile,
} from "@/types/user"

const navigationItems: Array<{
  label: string
  icon: typeof LayoutDashboard
  href?: string
  badge?: string
  requiresSindico?: boolean
}> = [
  { label: "Visão geral", icon: LayoutDashboard, href: "/home" },
  {
    label: "Usuários",
    icon: UsersRound,
    href: "/users",
    requiresSindico: true,
  },
  { label: "Moradores", icon: UsersRound },
  { label: "Unidades", icon: Home },
  { label: "Financeiro", icon: CircleDollarSign },
  { label: "Reservas", icon: CalendarDays },
  { label: "Solicitações", icon: ClipboardList, badge: "4" },
  { label: "Comunicados", icon: MessageSquare },
]

export function AuthenticatedLayout({
  children,
  user,
}: Readonly<{
  children: React.ReactNode
  user: UserProfile | null
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isProfileMenuOpen])

  async function handleLogout() {
    setIsProfileMenuOpen(false)
    setIsLoggingOut(true)
    await logout()
    router.replace("/login")
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-muted/40">
      <div className="flex min-h-svh w-full">
        <aside className="relative z-20 flex w-full shrink-0 flex-col border-b bg-background px-4 py-5 sm:px-6 lg:sticky lg:top-0 lg:h-svh lg:max-h-svh lg:w-72 lg:overflow-visible lg:border-r lg:border-b-0 lg:px-5">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-semibold tracking-tight">
                syndica
              </span>
              <span className="text-xs text-muted-foreground">
                Gestão condominial
              </span>
            </div>
          </div>

          <nav
            className="mt-8 flex flex-1 flex-col gap-1"
            aria-label="Menu principal"
          >
            <span className="mb-2 px-3 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Menu principal
            </span>
            {navigationItems
              .filter((item) => !item.requiresSindico || hasUserManagementAccess(user))
              .map((item) => {
              const Icon = item.icon
              const isActive = item.href === pathname

              return item.href ? (
                <Button
                  key={item.label}
                  render={<Link href={item.href} />}
                  nativeButton={false}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-3 px-3"
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon aria-hidden="true" data-icon="inline-start" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge ? (
                    <span
                      className={
                        isActive
                          ? "rounded-full bg-primary-foreground/15 px-2 py-0.5 text-xs text-primary-foreground"
                          : "rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive"
                      }
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Button>
              ) : (
                <Button
                  key={item.label}
                  type="button"
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3"
                  disabled
                >
                  <Icon aria-hidden="true" data-icon="inline-start" />
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              )
              })}
          </nav>

          <div ref={profileMenuRef} className="relative mt-6 border-t pt-5">
            {isProfileMenuOpen ? (
              <div
                id="profile-menu"
                className="absolute bottom-full left-0 z-50 mb-2 flex w-52 flex-col gap-1 rounded-xl border bg-background p-2 shadow-lg lg:bottom-0 lg:left-full lg:mb-0 lg:ml-2"
              >
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 text-muted-foreground"
                >
                  <Settings aria-hidden="true" data-icon="inline-start" />
                  Configurações
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut aria-hidden="true" data-icon="inline-start" />
                  {isLoggingOut ? "Saindo..." : "Sair"}
                </Button>
              </div>
            ) : null}

            <div className="flex w-full items-center gap-3 rounded-lg p-2">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                AO
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium">
                  {user?.username || "Ana Oliveira"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Administradora
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                aria-label="Abrir menu do perfil"
                aria-expanded={isProfileMenuOpen}
                aria-controls="profile-menu"
              >
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </div>
          </div>
        </aside>

        {children}
      </div>
    </main>
  )
}
