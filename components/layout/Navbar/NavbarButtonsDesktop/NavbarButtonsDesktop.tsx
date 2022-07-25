import { FC } from "react";
// Components
import { Box } from "@mui/material";
import NavbarButtonDesktop from "./NavbarButtonDesktop";
// Hooks
import { useRouter } from "next/router";
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
};

const NavbarButtonsDesktop: FC<Props> = ({ user, generateOnClick }) => {
  const router = useRouter();

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
          isCurrentPage={option.currentPageRegExp.test(router.pathname)}
        />
      ))}
    </Box>
  );
};
export default NavbarButtonsDesktop;
