import React, { FC, useState } from "react";
// Components
import NavbarButtonMobile from "./NavbarButtonMobile";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, IconButton, Menu } from "@mui/material";
// Hooks
import { useRouter } from "next/router";
// Helpers
import { NAVBAR_OPTIONS } from "../Navbar.helpers";
// Types
import { User } from "@/types/users";

type Props = {
  user?: User;
  generateOnClick: ({
    route,
    action,
  }: {
    route?: string;
    action?: string;
  }) => () => void;
};

const NavbarButtonsMobile: FC<Props> = ({ user, generateOnClick }) => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
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
          <NavbarButtonMobile
            key={option.label}
            option={option}
            generateOnClick={generateOnClick}
            isCurrentPage={option.currentPageRegExp.test(router.pathname)}
            user={user}
            handleCloseNavMenu={handleCloseNavMenu}
          />
        ))}
      </Menu>
    </Box>
  );
};
export default NavbarButtonsMobile;
