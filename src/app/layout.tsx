import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import PersonalProviderTheme from "@/providers/theme-provider";
import SessionProvider from "@/providers/session-provider";
import SessionErrorHandler from "@/providers/session-error-handler";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Syndica",
    description: "Your sass for management",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body className={poppins.variable}>
                <SessionProvider>
                    <SessionErrorHandler />
                    <PersonalProviderTheme>{children}</PersonalProviderTheme>
                </SessionProvider>
            </body>
        </html>
    );
}
