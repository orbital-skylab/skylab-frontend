import { NavbarOption } from "@/helpers/navigation";
import { User } from "@/types/users";
import { Box } from "@mui/material";
import { FC } from "react";
import NavbarButtonDesktop from "./NavbarButtonDesktop";

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

const NavbarButtonsDesktop: FC<Props> = ({
  options,
  user,
  generateOnClick,
  isCurrentPage,
}) => {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        gap: "0.5rem",
      }}
    >
      {options.map((option) => (
        <NavbarButtonDesktop
          id={option.id}
          key={option.label}
          option={option}
          user={user}
          generateOnClick={generateOnClick}
          isCurrentPage={isCurrentPage}
        />
      ))}
    </Box>
  );
};
export default NavbarButtonsDesktop;
