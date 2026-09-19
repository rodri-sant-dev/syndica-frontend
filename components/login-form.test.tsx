import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi, beforeEach } from "vitest"

import LoginForm from "./login-form"
import { loginAction } from "@/app/actions/auth"

vi.mock("@/app/actions/auth", () => ({
  loginAction: vi.fn(),
}))

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(loginAction).mockReset()
    vi.spyOn(console, "log").mockImplementation(() => undefined)
  })

  it("shows validation errors before calling the backend", async () => {
    const user = userEvent.setup()

    render(<LoginForm />)

    await user.click(screen.getByRole("button", { name: /entrar na plataforma/i }))

    expect(loginAction).not.toHaveBeenCalled()
    expect(screen.getByText("E-mail é obrigatório.")).toBeInTheDocument()
    expect(screen.getByText("Senha é obrigatória.")).toBeInTheDocument()
  })

  it("submits valid credentials and shows the success feedback", async () => {
    const user = userEvent.setup()
    vi.mocked(loginAction).mockResolvedValue({
      success: true,
      message: "Login realizado com sucesso.",
    })

    render(<LoginForm />)

    await user.type(screen.getByLabelText("E-mail"), "admin@syndica.com")
    await user.type(screen.getByLabelText("Senha"), "secret123")
    await user.click(screen.getByRole("button", { name: /entrar na plataforma/i }))

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith({
        email: "admin@syndica.com",
        password: "secret123",
      })
    })

    expect(screen.getByText("Login realizado com sucesso.")).toBeInTheDocument()
  })

  it("shows backend errors when the login request fails", async () => {
    const user = userEvent.setup()
    vi.mocked(loginAction).mockResolvedValue({
      success: false,
      message: "E-mail ou senha inválidos.",
    })

    render(<LoginForm />)

    await user.type(screen.getByLabelText("E-mail"), "admin@syndica.com")
    await user.type(screen.getByLabelText("Senha"), "wrongpass")
    await user.click(screen.getByRole("button", { name: /entrar na plataforma/i }))

    await waitFor(() => {
      expect(screen.getByText("E-mail ou senha inválidos.")).toBeInTheDocument()
    })
  })
})
