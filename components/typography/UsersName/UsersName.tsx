import { PAGES } from "@/helpers/navigation";
import { BASE_TRANSITION } from "@/styles/constants";
import { UserMetadata } from "@/types/users";
import { Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

type Props = {
  user: UserMetadata;
};

const UsersName: FC<Props> = ({ user }) => {
  return (
    <Link href={`${PAGES.USERS}/${user.id}`} passHref>
      <Typography
        variant="subtitle1"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: BASE_TRANSITION,
          "&:hover": {
            textDecoration: "underline",
            color: "secondary.main",
          },
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        {user.name}
      </Typography>
    </Link>
  );
};

export default UsersName;
