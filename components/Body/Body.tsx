import { FC } from "react";
import { Box } from "@mui/system";
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";

const Body: FC = ({ children }) => {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          paddingTop: NAVBAR_HEIGHT_REM,
          paddingX: "1rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </>
  );
};
export default Body;
