import { describe, expect, it } from "vitest"

import {
  formatAccessDate,
  getGreeting,
} from "@/components/dashboard/home-dashboard"

describe("home dashboard date and greeting", () => {
  it("selects the greeting according to the access time", () => {
    expect(getGreeting(new Date(2026, 8, 21, 11))).toBe("Bom dia")
    expect(getGreeting(new Date(2026, 8, 21, 15))).toBe("Boa tarde")
    expect(getGreeting(new Date(2026, 8, 21, 20))).toBe("Boa noite")
  })

  it("formats the real access date in Portuguese", () => {
    expect(formatAccessDate(new Date(2026, 8, 21))).toContain("segunda-feira")
    expect(formatAccessDate(new Date(2026, 8, 21))).toContain("21")
    expect(formatAccessDate(new Date(2026, 8, 21))).toContain("setembro")
  })
})
