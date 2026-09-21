"use client"

import { Plus, Search, UserRound } from "lucide-react"
import { FormEvent, useMemo, useState } from "react"

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Button } from "@/components/ui/button"

type UserRole = "Administrador" | "Síndico" | "Morador"

type User = {
  id: number
  name: string
  email: string
  role: UserRole
  lastAccess: string
  active: boolean
}

type UserForm = {
  name: string
  email: string
  role: UserRole
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Ana Oliveira",
    email: "ana.oliveira@syndica.com",
    role: "Administrador",
    lastAccess: "Hoje, 09:42",
    active: true,
  },
  {
    id: 2,
    name: "Mariana Costa",
    email: "mariana.costa@email.com",
    role: "Síndico",
    lastAccess: "Ontem, 18:20",
    active: true,
  },
  {
    id: 3,
    name: "Rafael Mendes",
    email: "rafael.mendes@email.com",
    role: "Morador",
    lastAccess: "18 set, 14:05",
    active: true,
  },
  {
    id: 4,
    name: "Camila Rocha",
    email: "camila.rocha@email.com",
    role: "Morador",
    lastAccess: "12 set, 08:30",
    active: false,
  },
]

const roleItems = [
  { label: "Administrador", value: "Administrador" },
  { label: "Síndico", value: "Síndico" },
  { label: "Morador", value: "Morador" },
]

const emptyForm: UserForm = { name: "", email: "", role: "Morador" }

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function roleVariant(role: UserRole) {
  return role === "Administrador"
    ? "default"
    : role === "Síndico"
      ? "secondary"
      : "outline"
}

export function UsersDashboard() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState("")
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>(
    {}
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState("")

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return users
    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    )
  }, [query, users])

  function toggleUser(id: number, active: boolean) {
    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === id ? { ...user, active } : user))
    )
    const user = users.find((item) => item.id === id)
    if (user)
      setFeedback(`${user.name} foi ${active ? "ativado" : "desativado"}.`)
  }

  function validateForm() {
    const nextErrors: typeof errors = {}
    if (form.name.trim().length < 3)
      nextErrors.name = "Informe o nome completo."
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      nextErrors.email = "Informe um e-mail válido."
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validateForm()) return
    const newUser: User = {
      id: Math.max(...users.map((user) => user.id), 0) + 1,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      lastAccess: "Ainda não acessou",
      active: true,
    }
    setUsers((currentUsers) => [newUser, ...currentUsers])
    setForm(emptyForm)
    setErrors({})
    setIsDialogOpen(false)
    setFeedback(`${newUser.name} foi adicionado à lista de usuários.`)
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
              Gerencie os acessos e perfis do Residencial Aurora.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button />}>
              <Plus aria-hidden="true" data-icon="inline-start" />
              Novo usuário
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados para adicionar um novo acesso.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <FieldGroup>
                  <Field data-invalid={Boolean(errors.name)}>
                    <FieldLabel htmlFor="user-name">Nome completo</FieldLabel>
                    <Input
                      id="user-name"
                      value={form.name}
                      aria-invalid={Boolean(errors.name)}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                    />
                    {errors.name ? (
                      <FieldError>{errors.name}</FieldError>
                    ) : null}
                  </Field>
                  <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="user-email">E-mail</FieldLabel>
                    <Input
                      id="user-email"
                      type="email"
                      value={form.email}
                      aria-invalid={Boolean(errors.email)}
                      onChange={(event) =>
                        setForm({ ...form, email: event.target.value })
                      }
                    />
                    {errors.email ? (
                      <FieldError>{errors.email}</FieldError>
                    ) : (
                      <FieldDescription>
                        Será usado para entrar na plataforma.
                      </FieldDescription>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="user-role">Perfil</FieldLabel>
                    <Select
                      items={roleItems}
                      value={form.role}
                      onValueChange={(value) =>
                        setForm({ ...form, role: value as UserRole })
                      }
                    >
                      <SelectTrigger id="user-role" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roleItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose
                    render={<Button type="button" variant="outline" />}
                  >
                    Cancelar
                  </DialogClose>
                  <Button type="submit">Adicionar usuário</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {feedback ? (
          <p
            role="status"
            aria-live="polite"
            className="text-sm font-medium text-primary"
          >
            {feedback}
          </p>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Lista de usuários</CardTitle>
            <CardDescription>
              Confira quem pode acessar a gestão condominial e altere o status
              quando necessário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Field className="sm:max-w-sm">
                <FieldLabel htmlFor="user-search" className="sr-only">
                  Pesquisar usuários
                </FieldLabel>
                <div className="relative">
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
              </Field>
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {initials(user.name)}
                            </AvatarFallback>
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
                        <Badge variant={roleVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastAccess}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? "secondary" : "outline"}>
                          {user.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Switch
                            checked={user.active}
                            onCheckedChange={(checked) =>
                              toggleUser(user.id, checked)
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
                        <span className="truncate font-medium">
                          {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={user.active}
                      onCheckedChange={(checked) =>
                        toggleUser(user.id, checked)
                      }
                      aria-label={`${user.active ? "Desativar" : "Ativar"} ${user.name}`}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                    <span className="text-muted-foreground">
                      {user.lastAccess}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserRound aria-hidden="true" data-icon="inline-start" />
                    {user.active ? "Acesso liberado" : "Acesso bloqueado"}
                  </div>
                </article>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t text-xs text-muted-foreground">
            As alterações são mockadas e ficam disponíveis apenas nesta sessão.
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
