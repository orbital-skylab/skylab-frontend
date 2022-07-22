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
import { PAGES, NAVBAR_ACTIONS, NAVBAR_OPTIONS } from "@/helpers/navigation";
// Constants
import { BASE_TRANSITION, NAVBAR_HEIGHT_REM } from "@/styles/constants";

const Navbar: FC = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const trigger = useScrollTrigger({ threshold: 0 });

  /**
   * Helper functions
   */
  const isCurrentPage = (path: string | undefined) => {
    if (path === undefined) {
      return false;
    } else if (path.split("/").length < 2) {
      return false;
    }
    return (
      router.asPath.split("/")[1].toLowerCase() ===
      path.split("/")[1].toLowerCase()
    );
  };

  const generateOnClick = ({
    route,
    action,
  }: {
    route?: string;
    action?: string;
  }) => {
    if (route) {
      return () => {
        if (router.pathname !== route) {
          router.push(route);
        }
      };
    }

    switch (action) {
      case NAVBAR_ACTIONS.SIGN_OUT:
        return () => {
          signOut();
        };

      default:
        return () => console.error("Invalid Navbar Action Provided");
    }
  };

  const renderNavigationButtons = () => {
    if (user) {
      return (
        <>
          <NavbarButtonsMobile
            options={NAVBAR_OPTIONS}
            user={user}
            generateOnClick={generateOnClick}
            isCurrentPage={isCurrentPage}
          />
          <NavbarButtonsDesktop
            options={NAVBAR_OPTIONS}
            user={user}
            generateOnClick={generateOnClick}
            isCurrentPage={isCurrentPage}
          />
        </>
      );
    } else {
      return <SignInButton />;
    }
  };

  return (
    <AppBar
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
