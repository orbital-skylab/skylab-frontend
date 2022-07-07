import type { AppProps } from "next/app";
// Libraries
import { ThemeProvider } from "@mui/material/styles";
// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomHead from "@/components/CustomHead/CustomHead";
// Hooks
import { AuthProvider } from "@/hooks/useAuth";
import { CohortProvider } from "@/hooks/useCohort";
// Styling
import "../styles/globals.scss";
import { theme } from "@/styles/muiTheme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CustomHead />
      <CohortProvider>
        <AuthProvider>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </CohortProvider>
    </ThemeProvider>
  );
}

export default MyApp;
