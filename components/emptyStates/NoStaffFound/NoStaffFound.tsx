import { Box, Typography } from "@mui/material";
import { FC } from "react";

const NoStaffFound: FC = () => {
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
      <Typography variant="subtitle1">No such staff found</Typography>
    </Box>
  );
};
export default NoStaffFound;
