import React, { useCallback, useState, FC } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { PAGES, NAVBAR_ACTIONS, NAVBAR_OPTIONS } from "@/helpers/navigation";
import { BASE_TRANSITION, NAVBAR_HEIGHT_REM } from "@/styles/constants";
import useAuth from "@/hooks/useAuth";
import { LANDING_SIGN_IN_ID } from "../Hero/HeroSignIn";

const Navbar: FC = () => {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const trigger = useScrollTrigger({ threshold: 0 });

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const renderNavigationButtons = useCallback(() => {
    const pushRoute = (route: string) => {
      if (router.pathname !== route) {
        router.push(route);
      }
    };

    const generateAction = ({
      route,
      action,
    }: {
      route?: string;
      action?: string;
    }) => {
      if (route) {
        return () => pushRoute(route);
      } else if (action === NAVBAR_ACTIONS.SIGN_OUT) {
        return logOut;
      } else {
        return () => alert("Invalid action");
      }
    };

    if (user) {
      return (
        <>
          {/* Mobile Hamburger Icon */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="button to view navigation"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ padding: 0 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {NAVBAR_OPTIONS.map((option) => (
                <MenuItem
                  key={option.label}
                  // TOOD: Clean up this ternary operation
                  onClick={generateAction(option)}
                >
                  <Typography textAlign="center">{option.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Desktop list of navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            {NAVBAR_OPTIONS.map((option) => (
              <Button
                key={option.label}
                onClick={generateAction(option)}
                sx={{ my: 2, display: "block", color: "inherit" }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </>
      );
    } else {
      return <SignInButton />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorElNav, user]);

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
            <Typography
              variant="h6"
              fontWeight={600}
              noWrap
              component="a"
              sx={{
                display: "flex",
                letterSpacing: ".25rem",
                color: "inherit",
                textDecoration: "none",
                "&:hover": { color: "secondary.main" },
                transition: BASE_TRANSITION,
              }}
            >
              Skylab
            </Typography>
          </Link>

          {renderNavigationButtons()}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;

const SignInButton = () => {
  const router = useRouter();

  if (router.pathname === PAGES.LANDING) {
    return (
      <Button
        variant="contained"
        onClick={() => {
          if (router.pathname === PAGES.LANDING) {
            const heroSignIn = document.querySelector("#" + LANDING_SIGN_IN_ID);
            heroSignIn?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }}
      >
        Sign In
      </Button>
    );
  } else {
    return (
      <Link href={PAGES.LANDING} passHref>
        <Button variant="contained">Sign In</Button>
      </Link>
    );
  }
};
