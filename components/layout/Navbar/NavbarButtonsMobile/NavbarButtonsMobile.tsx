import { NavbarOption } from "@/helpers/navigation";
import { User } from "@/types/users";
import { Box, IconButton, Menu } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import React, { FC, useState } from "react";
import NavbarButtonMobile from "./NavbarButtonMobile";

type Props = {
  options: NavbarOption[];
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
  options,
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
        {options.map((option) => (
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
