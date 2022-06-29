import { NavbarOption } from "@/helpers/navigation";
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
  if (!option.checkIfVisible(user)) {
    return null;
  }

  return (
    <Button
      key={option.label}
      onClick={generateOnClick(option)}
      sx={{
        my: 2,
        display: "block",
        color: "inherit",
        background: isCurrentPage(option.route)
          ? "rgba(13, 13, 13, 0.08)"
          : "inherit",
      }}
      disabled={isCurrentPage(option.route)}
    >
      {option.label}
    </Button>
  );
};
export default NavbarButtonDesktop;
