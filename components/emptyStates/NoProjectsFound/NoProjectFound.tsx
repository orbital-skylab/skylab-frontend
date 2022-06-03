import { Box, Typography } from "@mui/material";
import { FC } from "react";

const NoProjectFound: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        marginY: "15vh",
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Oops!
      </Typography>
      <Typography variant="subtitle1">No such projects found</Typography>
    </Box>
  );
};
export default NoProjectFound;
