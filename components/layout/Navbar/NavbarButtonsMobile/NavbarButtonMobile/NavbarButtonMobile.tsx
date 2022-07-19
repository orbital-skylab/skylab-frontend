import { NavbarOption } from "@/helpers/navigation";
import { userHasRole } from "@/helpers/roles";
import { User } from "@/types/users";
import { MenuItem, Typography } from "@mui/material";
import { FC } from "react";

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
      id={option.id}
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
