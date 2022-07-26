import { FC } from "react";
// Components
import { Button } from "@mui/material";
// Types
import { User } from "@/types/users";
import { NavbarOption } from "../../Navbar.types";
// Helpers
import { userHasRole } from "@/helpers/roles";

type Props = {
  id: string;
  user?: User;
  option: NavbarOption;
  generateOnClick: ({
    route,
    action,
  }: {
    route?: string;
    action?: string;
  }) => () => void;
  isCurrentPage: boolean;
};

const NavbarButtonDesktop: FC<Props> = ({
  id,
  user,
  option,
  generateOnClick,
  isCurrentPage,
}) => {
  // If page requires authorization AND (user is not signed in OR user is not authorized)
  if (
    option.authorizedRoles &&
    (!user || !userHasRole(user, option.authorizedRoles))
  ) {
    return null;
  }

  return (
    <Button
      id={id}
      key={option.label}
      onClick={generateOnClick(option)}
      sx={{
        my: 2,
        display: "block",
        color: isCurrentPage ? "gray" : "inherit",
        background: isCurrentPage ? "rgba(13, 13, 13, 0.08)" : "inherit",
      }}
    >
      {option.label}
    </Button>
  );
};
export default NavbarButtonDesktop;
