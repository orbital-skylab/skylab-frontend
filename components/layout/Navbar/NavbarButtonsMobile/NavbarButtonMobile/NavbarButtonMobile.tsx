import { FC } from "react";
// Components
import { MenuItem, Typography } from "@mui/material";
// Helpers
import { userHasRole } from "@/helpers/roles";
// Types
import { User } from "@/types/users";
import { NavbarOption } from "../../Navbar.types";

type Props = {
  user?: User;
  option: NavbarOption;
  generateOnClick: ({
    route,
    action,
  }: {
    route?: string;
    action?: string;
  }) => () => void;
  isCurrentPage: (path: string | undefined) => boolean;
  handleCloseNavMenu: () => void;
};

const NavbarButtonMobile: FC<Props> = ({
  user,
  option,
  generateOnClick,
  isCurrentPage,
  handleCloseNavMenu,
}) => {
  // If page requires authorization AND (user is not signed in OR user is not authorized)
  if (
    option.authorizedRoles &&
    (!user || !userHasRole(user, option.authorizedRoles))
  ) {
    return null;
  }

  return (
    <MenuItem
      onClick={() => {
        generateOnClick(option)();
        handleCloseNavMenu();
      }}
      selected={isCurrentPage(option.route)}
      sx={{
        color: isCurrentPage(option.route) ? "gray" : "inherit",
      }}
    >
      <Typography textAlign="center">{option.label}</Typography>
    </MenuItem>
  );
};
export default NavbarButtonMobile;
