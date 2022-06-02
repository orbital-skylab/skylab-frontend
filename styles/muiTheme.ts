import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: ["Lato", "Arial", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#0d0d0d",
      dark: "#336699",
    },
    secondary: {
      main: "#336699",
    },
  },
});
