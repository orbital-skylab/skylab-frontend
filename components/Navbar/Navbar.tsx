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
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";
import useAuth from "@/hooks/useAuth";

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
      if (router.asPath !== route) {
        router.push(route);
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
                  onClick={
                    option.route
                      ? () => pushRoute(option.route)
                      : option.action === NAVBAR_ACTIONS.SIGN_OUT
                      ? logOut
                      : () => {
                          alert("Invalid action");
                        }
                  }
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
                // TOOD: Clean up this ternary operation
                onClick={
                  option.route
                    ? () => pushRoute(option.route)
                    : option.action === NAVBAR_ACTIONS.SIGN_OUT
                    ? logOut
                    : () => {
                        alert("Invalid action");
                      }
                }
                sx={{ my: 2, display: "block", color: "inherit" }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </>
      );
    } else {
      return (
        <Box>
          <Link href={PAGES.LANDING} passHref>
            <Button variant="contained" color="primary">
              Sign In
            </Button>
          </Link>
        </Box>
      );
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
