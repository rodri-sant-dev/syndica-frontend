import { NextResponse } from "next/server"

import { auth } from "@/auth"

export default auth((request) => {
  const { pathname, search } = request.nextUrl

  if (pathname === "/login") {
    if (request.auth) {
      return NextResponse.redirect(new URL("/home", request.url))
    }

    return NextResponse.next()
  }

  if (request.auth) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  const returnTo = `${pathname}${search}`

  if (returnTo !== "/") {
    loginUrl.searchParams.set("returnTo", returnTo)
  }

  return NextResponse.redirect(loginUrl)
})

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
