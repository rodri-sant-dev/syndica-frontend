"use client";

import { useState } from "react";
import {
	Collapse,
	Drawer,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import {
	AccountBalance as CondominiumsIcon,
	Apartment as UnitsIcon,
	ExpandMore,
	Home as DashboardIcon,
	People as ResidentsIcon,
	Payments as FinanceIcon,
	Settings as ManagementIcon,
} from "@mui/icons-material";

interface DrawerMenuProps {
	open: boolean;
	onClose: () => void;
}

export default function DrawerMenu({ open, onClose }: DrawerMenuProps) {
	const [managementOpen, setManagementOpen] = useState(false);

	return (
		<Drawer anchor="left" open={open} onClose={onClose}>
			<List sx={{ width: 280 }}>
				<ListItemButton>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard" />
				</ListItemButton>
				<ListItemButton>
					<ListItemIcon>
						<ResidentsIcon />
					</ListItemIcon>
					<ListItemText primary="Moradores" />
				</ListItemButton>
				<ListItemButton onClick={() => setManagementOpen((value) => !value)}>
					<ListItemIcon>
						<ManagementIcon />
					</ListItemIcon>
					<ListItemText primary="Gestão" />
					<ExpandMore
						sx={{
							transform: managementOpen ? "rotate(-90deg)" : "rotate(0deg)",
							transition: "transform 200ms ease-in-out",
						}}
					/>
				</ListItemButton>
				<Collapse
					in={managementOpen}
					timeout={250}
					easing={{ enter: "ease-out", exit: "ease-in" }}
					unmountOnExit
				>
					<List component="div" disablePadding>
						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<CondominiumsIcon />
							</ListItemIcon>
							<ListItemText primary="Condomínios" />
						</ListItemButton>
						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<UnitsIcon />
							</ListItemIcon>
							<ListItemText primary="Unidades" />
						</ListItemButton>
						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<FinanceIcon />
							</ListItemIcon>
							<ListItemText primary="Financeiro" />
						</ListItemButton>
					</List>
				</Collapse>
			</List>
		</Drawer>
	);
}
