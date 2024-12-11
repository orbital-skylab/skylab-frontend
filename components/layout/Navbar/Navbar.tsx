import React, { FC } from "react";
// Components
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  useScrollTrigger,
  Box,
  Stack,
} from "@mui/material";
import NavbarButtonsMobile from "./NavbarButtonsMobile";
import NavbarButtonsDesktop from "./NavbarButtonsDesktop";
import SignInButton from "./SignInButton";
// Hooks
import useAuth from "@/contexts/useAuth";
// Helpers
import { useRouter } from "next/router";
import Link from "next/link";
import { PAGES } from "@/helpers/navigation";
// Constants
import { BASE_TRANSITION, NAVBAR_HEIGHT_REM } from "@/styles/constants";
import { generateOnClickGenerator } from "./Navbar.helpers";

const Navbar: FC = () => {
  const router = useRouter();
  const {
    user,
    isExternalVoter,
    signOut: userSignOut,
    externalVoterSignOut,
  } = useAuth();
  const trigger = useScrollTrigger({ threshold: 0 });

  const signOut = user ? userSignOut : externalVoterSignOut;

  const renderNavigationButtons = () => {
    if (user || isExternalVoter) {
      return (
        <>
          <NavbarButtonsMobile
            user={user}
            generateOnClick={generateOnClickGenerator(user, router, signOut)}
          />
          <NavbarButtonsDesktop
            user={user}
            generateOnClick={generateOnClickGenerator(user, router, signOut)}
          />
        </>
      );
    } else {
      return <SignInButton />;
    }
  };

  return (
    <AppBar
      id="auth-nav-bar"
      position="fixed"
      color="transparent"
      elevation={trigger ? 4 : 0}
      sx={{
        backdropFilter: "blur(0.3rem)",
        height: NAVBAR_HEIGHT_REM,
      }}
    >
      <Container maxWidth="xl" sx={{ marginY: "auto" }}>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Link href={PAGES.LANDING} passHref>
            <Stack
              direction="row"
              spacing="0.5rem"
              alignItems="center"
              sx={{
                cursor: "pointer",
                transition: BASE_TRANSITION,
                "&:hover": {
                  transform: "scale(105%)",
                  "& .skylab": {
                    color: "secondary.main",
                    transform: "scale(105%)",
                  },
                },
              }}
            >
              <Box
                component="img"
                src="/skylab-logo.png"
                alt="Skylab Logo"
                sx={{
                  height: "24px",
                  width: "24px",
                }}
              />
              <Typography
                variant="h6"
                fontWeight={600}
                noWrap
                component="a"
                className="skylab"
                sx={{
                  display: "flex",
                  letterSpacing: ".25rem",
                  color: "inherit",
                  textDecoration: "none",
                  transition: BASE_TRANSITION,
                }}
              >
                Skylab
              </Typography>
            </Stack>
          </Link>
          {renderNavigationButtons()}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
