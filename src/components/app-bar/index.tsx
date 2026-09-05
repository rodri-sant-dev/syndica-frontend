"use client";

import { useState, MouseEvent } from "react";
import { signOut, useSession } from "next-auth/react";
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Settings as SettingsIcon,
    DarkMode as DarkModeIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import DrawerMenu from "@/components/drawer-menu";

import { blacklistToken } from "@/services/login-service";

export default function AppTopBar() {
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const open = Boolean(anchorEl);

    function handleAvatarClick(event: MouseEvent<HTMLElement>) { setAnchorEl(event.currentTarget); }

    function handleMenuClose() { setAnchorEl(null); }

    async function handleLogout() {
        await blacklistToken(session!.refreshToken);
        await signOut({ callbackUrl: "/login" });
    }

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>

                <Box>
                    <IconButton onClick={handleAvatarClick} size="small">
                            <Avatar
                                sx={{ width: 32, height: 32 }}
                                src={session!.user.imageURI}
                                alt={session?.user.fullname}
                            />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem>
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            Configurações
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <DarkModeIcon fontSize="small" />
                            </ListItemIcon>
                            Tema
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={handleLogout}
                            sx={{ color: "error.main" }}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            Sair
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
            <DrawerMenu
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </AppBar>
    );
}
