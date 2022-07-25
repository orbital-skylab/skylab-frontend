import { BASE_TRANSITION } from "@/styles/constants";
import { Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

type Props = {
  href: string;
};

const HoverLink: FC<Props> = ({ href, children }) => {
  return (
    <Link href={href} passHref>
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
        {children}
      </Typography>
    </Link>
  );
};
export default HoverLink;
