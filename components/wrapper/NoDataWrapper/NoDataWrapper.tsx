import { PAGES } from "@/helpers/navigation";
import { FULL_HEIGHT_MINUS_NAV } from "@/styles/constants";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

type Props = {
  noDataCondition: boolean;
};

const NoDataWrapper: FC<Props> = ({ children, noDataCondition }) => {
  if (noDataCondition) {
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
        <Typography variant="h5" fontWeight={600}>
          Oops! No such user found
        </Typography>
        <Link href={PAGES.LANDING} passHref>
          <Button variant="contained">Return Home</Button>
        </Link>
      </Box>
    );
  }

  return <>{children}</>;
};
export default NoDataWrapper;
