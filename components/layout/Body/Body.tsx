import { FC } from "react";
import { Box, SxProps } from "@mui/system";
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";
import LoadingWrapper from "../../wrappers/LoadingWrapper";
import ErrorWrapper from "../../wrappers/ErrorWrapper";
import useAuth from "@/hooks/useAuth";
import { Alert, Button } from "@mui/material";
import { ROLES } from "@/types/roles";
import UnauthorizedWrapper from "@/components/wrappers/UnauthorizedWrapper";
import { userHasRole } from "@/helpers/roles";

type Props = {
  flexColCenter?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isError?: boolean;
  authorizedRoles?: ROLES[];
};

const Body: FC<Props> = ({
  children,
  flexColCenter,
  isLoading = false,
  loadingText,
  isError = false,
  authorizedRoles,
}) => {
  const {
    user,
    isPreviewMode,
    stopPreview,
    isLoading: isLoadingUser,
  } = useAuth();

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

  const requiresAuthorizationAndIsLoadingUser = Boolean(
    authorizedRoles && isLoadingUser
  );
  const isAuthorized =
    !authorizedRoles ||
    (authorizedRoles && user && userHasRole(user, authorizedRoles));

  return (
    <>
      <Box sx={boxSx}>
        <LoadingWrapper
          isLoading={!!isLoading || requiresAuthorizationAndIsLoadingUser}
          loadingText={loadingText}
          fullScreen
        >
          <UnauthorizedWrapper isUnauthorized={!isAuthorized}>
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
          </UnauthorizedWrapper>
        </LoadingWrapper>
      </Box>
    </>
  );
};
export default Body;
