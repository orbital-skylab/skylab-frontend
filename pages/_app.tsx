import type { AppProps } from "next/app";
// Libraries
import { ThemeProvider } from "@mui/material/styles";
// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomHead from "@/components/layout/CustomHead";
// Contexts
import { AuthProvider } from "@/contexts/useAuth";
import { CohortProvider } from "@/contexts/useCohort";
import { SnackbarAlertProvider } from "@/contexts/useSnackbarAlert";
// Styling
import "../styles/globals.scss";
import { theme } from "@/styles/muiTheme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CustomHead />
      <SnackbarAlertProvider>
        <CohortProvider>
          <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </AuthProvider>
        </CohortProvider>
      </SnackbarAlertProvider>
    </ThemeProvider>
  );
}

export default MyApp;
