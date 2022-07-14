import React, { FC, useState } from "react";
// Components
import NavbarButtonMobile from "./NavbarButtonMobile";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, IconButton, Menu } from "@mui/material";
// Helpers
import { NAVBAR_OPTIONS } from "@/helpers/navigation";
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
  isCurrentPage: (path: string | undefined) => boolean;
};

const NavbarButtonsMobile: FC<Props> = ({
  user,
  generateOnClick,
  isCurrentPage,
}) => {
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
            isCurrentPage={isCurrentPage}
            user={user}
            handleCloseNavMenu={handleCloseNavMenu}
          />
        ))}
      </Menu>
    </Box>
  );
};
export default NavbarButtonsMobile;
