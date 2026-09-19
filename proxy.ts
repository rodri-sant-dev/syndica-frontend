import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/auth"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname, search } = request.nextUrl

  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/home", request.url))
    }

    return NextResponse.next()
  }

  if (session) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  const returnTo = `${pathname}${search}`

  if (returnTo !== "/") {
    loginUrl.searchParams.set("returnTo", returnTo)
  }

  return NextResponse.redirect(loginUrl)
}

export default proxy

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
