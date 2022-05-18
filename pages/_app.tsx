import type { AppProps } from "next/app";
import Head from "next/head";
// Styling
import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/useAuth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#14213D",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>NUS Skylab</title>
        <meta name="description" content="NUS Skylab" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
