import { PAGES } from "@/helpers/navigation";
import { FULL_HEIGHT_MINUS_NAV } from "@/styles/constants";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { FC } from "react";

type Props = {
  isError: boolean;
};

const ErrorWrapper: FC<Props> = ({ children, isError }) => {
  if (isError) {
    return (
      <Box
        sx={{
          height: FULL_HEIGHT_MINUS_NAV,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Oops!
        </Typography>
        <Typography variant="subtitle1">An error has occurred</Typography>
        <Link href={PAGES.LANDING} passHref>
          <Button variant="contained">Return Home</Button>
        </Link>
      </Box>
    );
  }

  return <>{children}</>;
};
export default ErrorWrapper;
