import { NavbarOption } from "@/helpers/navigation";
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
  if (!option.checkIfVisible(user)) {
    return null;
  }

  return (
    <MenuItem
      onClick={() => {
        generateOnClick(option)();
        handleCloseNavMenu();
      }}
      selected={isCurrentPage(option.route)}
      disabled={isCurrentPage(option.route)}
    >
      <Typography textAlign="center">{option.label}</Typography>
    </MenuItem>
  );
};
export default NavbarButtonMobile;
