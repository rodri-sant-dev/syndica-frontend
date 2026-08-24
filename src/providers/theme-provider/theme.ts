"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		mode: "dark",
	},
	components:{
		MuiTextField:{
			defaultProps:{
				size: "small"
			},
		}
	},
	typography: {
		fontFamily: "var(--font-poppins)",
	},
});

export default theme;
