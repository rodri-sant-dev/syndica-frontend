"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

export default function SessionErrorHandler() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (session?.error !== "RefreshAccessTokenError") {
            return;
        }

        const query = searchParams.toString();
        const currentRoute = `${pathname}${query ? `?${query}` : ""}`;
        const callbackUrl = `/login?callbackUrl=${encodeURIComponent(currentRoute)}`;

        void signOut({ callbackUrl });
    }, [pathname, searchParams, session?.error]);

    return null;
}
