import { NavbarOption } from "@/helpers/navigation";
import { userHasRole } from "@/helpers/roles";
import { User } from "@/types/users";
import { Button } from "@mui/material";
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
};

const NavbarButtonDesktop: FC<Props> = ({
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
      key={option.label}
      onClick={generateOnClick(option)}
      sx={{
        my: 2,
        display: "block",
        color: isCurrentPage(option.route) ? "gray" : "inherit",
        background: isCurrentPage(option.route)
          ? "rgba(13, 13, 13, 0.08)"
          : "inherit",
      }}
    >
      {option.label}
    </Button>
  );
};
export default NavbarButtonDesktop;
