import { FC } from "react";
import { Box, SxProps } from "@mui/system";
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";
import LoadingWrapper from "../../wrappers/LoadingWrapper";
import ErrorWrapper from "../../wrappers/ErrorWrapper";
import useAuth from "@/hooks/useAuth";
import { Alert, Button } from "@mui/material";

type Props = {
  flexColCenter?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isError?: boolean;
};

const Body: FC<Props> = ({
  children,
  flexColCenter,
  isLoading,
  loadingText,
  isError,
}) => {
  const { user, isPreviewMode, stopPreview } = useAuth();

  const boxSx: SxProps = {
    minHeight: "100vh",
    height: "100%",
    paddingTop: NAVBAR_HEIGHT_REM,
    paddingX: "24px",
    maxWidth: "1536px",
    marginX: "auto",
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
        <LoadingWrapper
          isLoading={!!isLoading}
          loadingText={loadingText}
          fullScreen
        >
          <ErrorWrapper isError={!!isError}>
            {isPreviewMode && user && (
              <Alert
                color="warning"
                sx={{
                  mb: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {`You are currently previewing the page as: ${user.name}`}
                <Button
                  sx={{ marginLeft: "1rem" }}
                  color="warning"
                  size="small"
                  variant="outlined"
                  onClick={stopPreview}
                >
                  Stop Preview
                </Button>
              </Alert>
            )}
            {children}
          </ErrorWrapper>
        </LoadingWrapper>
      </Box>
    </>
  );
};
export default Body;
