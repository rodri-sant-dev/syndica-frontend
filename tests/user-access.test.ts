import { describe, expect, it } from "vitest"

import { hasUserManagementAccess } from "@/types/user"

describe("user management access", () => {
  it("allows users who have the SINDICO group among multiple groups", () => {
    expect(
      hasUserManagementAccess({
        username: "Mariana",
        email: "mariana@example.com",
        grupos: ["MORADOR", "sindico"],
      }),
    ).toBe(true)
  })

  it("does not allow users without the SINDICO group", () => {
    expect(
      hasUserManagementAccess({
        username: "Rafael",
        email: "rafael@example.com",
        grupos: ["MANAGER", "MORADOR"],
      }),
    ).toBe(false)
    expect(hasUserManagementAccess(null)).toBe(false)
  })
})
