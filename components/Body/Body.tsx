import { FC } from "react";
import { Box, SxProps } from "@mui/system";
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";
import LoadingWrapper from "../wrapper/LoadingWrapper";
import { Container } from "@mui/material";

type Props = {
  flexColCenter?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

const Body: FC<Props> = ({
  children,
  flexColCenter,
  isLoading,
  loadingText,
}) => {
  const boxSx: SxProps = {
    minHeight: "100vh",
    height: "100%",
    paddingTop: NAVBAR_HEIGHT_REM,
    paddingX: "1rem",
  };

  if (flexColCenter) {
    boxSx.display = "flex";
    boxSx.flexDirection = "column";
    boxSx.justifyContent = "center";
    boxSx.alignItems = "center";
  }

  return (
    <>
      <Box sx={boxSx}>
        <Container maxWidth="xl">
          <LoadingWrapper isLoading={!!isLoading} loadingText={loadingText}>
            {children}
          </LoadingWrapper>
        </Container>
      </Box>
    </>
  );
};
export default Body;
