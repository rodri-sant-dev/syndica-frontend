import { Box } from "@mui/material";
import AppTopBar from "@/components/app-bar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box>
            <AppTopBar />
            <Box sx={{ p: 3 }}>{children}</Box>
        </Box>
    );
}
