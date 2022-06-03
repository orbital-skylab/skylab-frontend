import { PAGES } from "@/helpers/navigation";
import { FULL_HEIGHT_MINUS_NAV } from "@/styles/constants";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

const NoUserFound: FC = () => {
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
        Oops!
      </Typography>
      <Typography variant="subtitle1">No user found with such email</Typography>
      <Link href={PAGES.LANDING} passHref>
        <Button variant="contained">Return Home</Button>
      </Link>
    </Box>
  );
};
export default NoUserFound;
