import { FC } from "react";
// Components
import { Box } from "@mui/material";
import NavbarButtonDesktop from "./NavbarButtonDesktop";
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
  isCurrentPage: (path: string | undefined) => boolean;
};

const NavbarButtonsDesktop: FC<Props> = ({
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
      {NAVBAR_OPTIONS.map((option) => (
        <NavbarButtonDesktop
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
