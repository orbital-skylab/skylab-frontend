import { BASE_TRANSITION } from "@/styles/constants";
import { Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

type Props = {
  href: string;
  wrap?: boolean;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2";
};

const HoverLink: FC<Props> = ({ href, wrap, variant, children }) => {
  return (
    <Link href={href} passHref>
      <Typography
        component="a"
        variant={variant}
        sx={{
          whiteSpace: wrap ? undefined : "nowrap",
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
