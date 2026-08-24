"use client";
import { ReactElement, ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline } from "@mui/material";


export default function PersonalProviderTheme({ children }: {children: ReactNode}) {
	const theme = createTheme({
		palette: {
			mode: "dark",
		},
		typography: {
			fontFamily: "var(--font-poppins)",
		},
	});
	return (
		<AppRouterCacheProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppRouterCacheProvider>
	);
}
