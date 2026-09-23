"use client"

import { Check, Eye, EyeOff, Plus, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  CreateUserPayload,
  UserManagementRecord,
} from "@/lib/actions/users"

type User = {
  id: string
  name: string
  email: string
  role: string
  lastAccess: string
  active: boolean
}

type UserFormValues = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

type ConfirmDialogState =
  | { kind: "create"; payload: UserFormValues }
  | { kind: "toggle"; user: User; nextActive: boolean }

type UsersDashboardProps = {
  initialUsers: UserManagementRecord[]
  createUserAction: (payload: CreateUserPayload) => Promise<UserManagementRecord>
  toggleUserAction: (userId: string, active: boolean) => Promise<UserManagementRecord>
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function normalizeRole(grupos?: string[]) {
  const normalized = (grupos ?? []).map((group) => group.trim().toUpperCase())

  if (normalized.includes("SINDICO")) {
    return "Síndico"
  }

  if (normalized.includes("MORADOR")) {
    return "Morador"
  }

  if (normalized.includes("ADMIN")) {
    return "Administrador"
  }

  return "Morador"
}

function mapUser(user: UserManagementRecord): User {
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    role: normalizeRole(user.grupos),
    lastAccess: "Sem registro",
    active: user.active,
  }
}

function roleVariant(role: string) {
  return role === "Administrador"
    ? "default"
    : role === "Síndico"
      ? "secondary"
      : "outline"
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    const statusLike = (error as Error & { status?: number }).status
    if (statusLike && statusLike >= 500) {
      return "Something went wrong while processing your request. Please try again in a moment."
    }

    return error.message
  }

  return fallback
}

export function UsersDashboard({
  initialUsers,
  createUserAction,
  toggleUserAction,
}: UsersDashboardProps) {
  const [users, setUsers] = useState<User[]>(() => initialUsers.map(mapUser))
  const [query, setQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(
    null,
  )
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)
  const [isConfirmingAction, setIsConfirmingAction] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password") ?? ""
  const passwordChecks = [
    { label: "8 ou mais caracteres", ok: password.length >= 8 },
    { label: "Ao menos uma letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Ao menos uma letra minúscula", ok: /[a-z]/.test(password) },
    { label: "Ao menos um número", ok: /\d/.test(password) },
    {
      label: "Ao menos um caractere especial",
      ok: /[^A-Za-z0-9]/.test(password),
    },
  ]

  useEffect(() => {
    setUsers(initialUsers.map(mapUser))
  }, [initialUsers])

  useEffect(() => {
    if (!feedback) {
      return
    }

    const timer = window.setTimeout(() => setFeedback(null), 4000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return users
    }

    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [query, users])

  async function handleConfirmAction() {
    if (!confirmDialog) {
      return
    }

    setIsConfirmingAction(true)

    try {
      if (confirmDialog.kind === "create") {
        const payload = {
          username: confirmDialog.payload.username.trim(),
          email: confirmDialog.payload.email.trim(),
          password: confirmDialog.payload.password,
        }

        const createdUser = await createUserAction(payload)
        const nextUser = mapUser(createdUser)

        setUsers((currentUsers) => [nextUser, ...currentUsers])
        setFeedback({
          type: "success",
          message: `${nextUser.name} foi adicionado com sucesso.`,
        })
        reset()
      }

      if (confirmDialog.kind === "toggle") {
        const toggledUser = await toggleUserAction(
          confirmDialog.user.id,
          confirmDialog.nextActive,
        )
        const nextUser = mapUser(toggledUser)

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === confirmDialog.user.id ? nextUser : user,
          ),
        )
        setFeedback({
          type: "success",
          message: `${nextUser.name} foi ${nextUser.active ? "ativado" : "desativado"}.`,
        })
      }

    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error, "Não foi possível concluir a operação."),
      })
    } finally {
      setConfirmDialog(null)
      setIsCreateDialogOpen(false)
      setIsConfirmingAction(false)
    }
  }

  return (
    <section className="min-h-svh min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Administração do condomínio
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Usuários
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie permissões e acessos do Residencial Aurora.
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger render={<Button />}>
              <Plus aria-hidden="true" data-icon="inline-start" />
              Novo usuário
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo usuário</DialogTitle>
                <DialogDescription>
                  Informe os dados do novo acesso e confirme antes de salvar.
                </DialogDescription>
              </DialogHeader>

              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit((values) => {
                  setConfirmDialog({ kind: "create", payload: values })
                })}
              >
                <FieldGroup>
                  <Field data-invalid={Boolean(errors.username)}>
                    <FieldLabel htmlFor="user-name">Nome completo</FieldLabel>
                    <Input
                      id="user-name"
                      aria-invalid={Boolean(errors.username)}
                      {...register("username", {
                        required: "Informe o nome completo.",
                        minLength: {
                          value: 3,
                          message: "O nome deve ter pelo menos 3 caracteres.",
                        },
                      })}
                    />
                    {errors.username ? (
                      <FieldError>{errors.username.message}</FieldError>
                    ) : null}
                  </Field>

                  <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="user-email">E-mail</FieldLabel>
                    <Input
                      id="user-email"
                      type="email"
                      aria-invalid={Boolean(errors.email)}
                      {...register("email", {
                        required: "Informe o e-mail.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Informe um e-mail válido.",
                        },
                      })}
                    />
                    {errors.email ? (
                      <FieldError>{errors.email.message}</FieldError>
                    ) : (
                      <FieldDescription>
                        Será usado para acesso e comunicação.
                      </FieldDescription>
                    )}
                  </Field>

                  <Field data-invalid={Boolean(errors.password)}>
                    <FieldLabel htmlFor="user-password">Senha</FieldLabel>
                    <div className="relative">
                      <Input
                        id="user-password"
                        type={isPasswordVisible ? "text" : "password"}
                        aria-invalid={Boolean(errors.password)}
                        {...register("password", {
                          required: "Informe a senha.",
                          validate: (value) =>
                            passwordChecks.every((check) => check.ok) ||
                            "A senha precisa atender a todos os requisitos.",
                        })}
                        className="pr-12"
                      />
                      <button
                        type="button"
                        aria-label={
                          isPasswordVisible ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        {isPasswordVisible ? (
                          <EyeOff aria-hidden="true" size={16} />
                        ) : (
                          <Eye aria-hidden="true" size={16} />
                        )}
                      </button>
                    </div>
                    {errors.password ? (
                      <FieldError>{errors.password.message}</FieldError>
                    ) : (
                      <div className="mt-2 grid gap-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                        {passwordChecks.map((check) => (
                          <div
                            key={check.label}
                            className="flex items-center gap-2"
                          >
                            <span
                              className={
                                check.ok
                                  ? "flex size-4 items-center justify-center rounded-full bg-primary/10 text-primary"
                                  : "flex size-4 items-center justify-center rounded-full border border-muted-foreground/40"
                              }
                            >
                              {check.ok ? <Check size={10} aria-hidden="true" /> : null}
                            </span>
                            <span>{check.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Field>

                  <Field data-invalid={Boolean(errors.confirmPassword)}>
                    <FieldLabel htmlFor="user-confirm-password">
                      Confirmar senha
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="user-confirm-password"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        {...register("confirmPassword", {
                          required: "Confirme a senha.",
                          validate: (value) =>
                            value === password || "As senhas não coincidem.",
                        })}
                        className="pr-12"
                      />
                      <button
                        type="button"
                        aria-label={
                          isConfirmPasswordVisible
                            ? "Ocultar confirmação da senha"
                            : "Mostrar confirmação da senha"
                        }
                        onClick={() =>
                          setIsConfirmPasswordVisible((visible) => !visible)
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        {isConfirmPasswordVisible ? (
                          <EyeOff aria-hidden="true" size={16} />
                        ) : (
                          <Eye aria-hidden="true" size={16} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword ? (
                      <FieldError>{errors.confirmPassword.message}</FieldError>
                    ) : null}
                  </Field>
                </FieldGroup>

                <DialogFooter>
                  <DialogClose
                    render={<Button type="button" variant="outline" />}
                  >
                    Cancelar
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Validando..." : "Adicionar usuário"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {feedback ? (
          <div
            role={feedback.type === "success" ? "status" : "alert"}
            aria-live="polite"
            className={
              feedback.type === "success"
                ? "fixed right-4 bottom-4 z-50 max-w-sm rounded-xl border border-primary/20 bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg"
                : "fixed right-4 bottom-4 z-50 max-w-sm rounded-xl border border-destructive/20 bg-destructive px-4 py-3 text-sm font-medium text-destructive-foreground shadow-lg"
            }
          >
            {feedback.message}
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Lista de usuários</CardTitle>
            <CardDescription>
              Consulte os acessos ativos e altere o status do usuário conforme
              necessário.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative sm:max-w-sm">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="user-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Pesquisar por nome, e-mail ou perfil"
                  className="pl-9"
                />
              </div>

              <p className="text-sm text-muted-foreground">
                {filteredUsers.length} de {users.length} usuários
              </p>
            </div>

            <Separator className="my-5" />

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Último acesso</TableHead>
                    <TableHead className="text-right">Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{initials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {user.lastAccess}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm text-muted-foreground">
                            {user.active ? "Ativo" : "Inativo"}
                          </span>
                          <Switch
                            checked={user.active}
                            onCheckedChange={() =>
                              setConfirmDialog({
                                kind: "toggle",
                                user,
                                nextActive: !user.active,
                              })
                            }
                            aria-label={`${user.active ? "Desativar" : "Ativar"} ${user.name}`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              {filteredUsers.map((user) => (
                <article
                  key={user.id}
                  className="flex flex-col gap-4 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate font-medium">{user.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <Switch
                      checked={user.active}
                      onCheckedChange={() =>
                        setConfirmDialog({
                          kind: "toggle",
                          user,
                          nextActive: !user.active,
                        })
                      }
                      aria-label={`${user.active ? "Desativar" : "Ativar"} ${user.name}`}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                    <span className="text-muted-foreground">{user.lastAccess}</span>
                  </div>
                </article>
              ))}
            </div>
          </CardContent>

          <CardFooter className="border-t text-xs text-muted-foreground">
            As alterações são sincronizadas com o backend em tempo real.
          </CardFooter>
        </Card>
      </div>

      <Dialog
        open={Boolean(confirmDialog)}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar operação</DialogTitle>
            <DialogDescription>
              {confirmDialog?.kind === "create"
                ? "Deseja cadastrar este usuário no condomínio?"
                : confirmDialog?.kind === "toggle"
                  ? `Deseja ${confirmDialog.nextActive ? "ativar" : "inativar"} o acesso de ${confirmDialog.user.name}?`
                  : "Confirme a operação para continuar."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm text-muted-foreground">
            {confirmDialog?.kind === "create" ? (
              <>
                <p>Nome: {confirmDialog.payload.username}</p>
                <p>E-mail: {confirmDialog.payload.email}</p>
                <p>Senha: será cadastrada conforme os requisitos da política.</p>
              </>
            ) : confirmDialog?.kind === "toggle" ? (
              <p>
                O usuário ficará <strong>{confirmDialog.nextActive ? "ativo" : "inativo"}</strong> a partir desta confirmação.
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmAction}
              disabled={isConfirmingAction}
            >
              {isConfirmingAction ? "Confirmando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
