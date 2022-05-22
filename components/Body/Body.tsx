import { FC } from "react";
import { Box } from "@mui/system";

const Body: FC = ({ children }) => {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          paddingTop: { xs: "56px", sm: "64px", md: "68.5px" },
          paddingX: "1rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </>
  );
};
export default Body;
