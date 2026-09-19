import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const signIn = vi.fn()
const replace = vi.fn()
const refresh = vi.fn()

vi.mock("next-auth/react", () => ({
  signIn,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}))

const { LoginForm } = await import("@/components/forms/login-form")

describe("LoginForm", () => {
  beforeEach(() => {
    signIn.mockReset()
    replace.mockReset()
    refresh.mockReset()
  })

  it("retorna para a rota solicitada após o login", async () => {
    signIn.mockResolvedValue({
      ok: true,
      url: "http://localhost:3000/contas",
    })

    render(<LoginForm returnTo="/contas" />)

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "password" },
    })
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "user@example.com",
        password: "password",
        redirect: false,
        callbackUrl: "/contas",
      })
      expect(replace).toHaveBeenCalledWith("http://localhost:3000/contas")
      expect(refresh).toHaveBeenCalled()
    })
  })

  it("usa /home quando não existe rota de retorno", async () => {
    signIn.mockResolvedValue({
      ok: true,
      url: "http://localhost:3000/home",
    })

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "password" },
    })
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "user@example.com",
        password: "password",
        redirect: false,
        callbackUrl: "/home",
      })
      expect(replace).toHaveBeenCalledWith("http://localhost:3000/home")
    })
  })

  it("rejeita uma URL externa e usa /home", async () => {
    signIn.mockResolvedValue({
      ok: true,
      url: "http://localhost:3000/home",
    })

    render(<LoginForm returnTo="https://malicious.example" />)

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "password" },
    })
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({ callbackUrl: "/home" }),
      )
    })
  })

  it("exibe erro quando as credenciais são rejeitadas", async () => {
    signIn.mockResolvedValue({ ok: false })

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "user@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "wrong-password" },
    })
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "E-mail ou senha incorretos.",
    )
  })
})
