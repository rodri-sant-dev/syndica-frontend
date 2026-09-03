import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname, search } = req.nextUrl;

    if (!isLoggedIn && pathname !== "/login" && pathname !== "/signup") {
        const loginUrl = new URL("/login", req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
        const homeUrl = new URL("/home", req.nextUrl.origin);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
