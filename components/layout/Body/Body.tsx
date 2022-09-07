import { FC } from "react";
// Components
import { Box, SxProps } from "@mui/system";
import { Alert, Button } from "@mui/material";
import LoadingWrapper from "../../wrappers/LoadingWrapper";
import ErrorWrapper from "../../wrappers/ErrorWrapper";
import UnauthorizedWrapper from "@/components/wrappers/UnauthorizedWrapper";
// Hooks
import useAuth from "@/contexts/useAuth";
import { useRouter } from "next/router";
// Helpers
import { userHasRole } from "@/helpers/roles";
import { PAGES } from "@/helpers/navigation";
// Constants
import { NAVBAR_HEIGHT_REM, WIDTH_XL } from "@/styles/constants";
// Types
import { ROLES } from "@/types/roles";

type Props = {
  sx?: SxProps;
  isLoading?: boolean;
  loadingText?: string;
  isError?: boolean;
  authorizedRoles?: ROLES[];
};

/**
 * Component that should wrap every page. Provides the following functionalities:
 * - Authorize users based on role
 * - Show alternate empty states (loading or error)
 * - Alert when user is in preview mode
 * - Styling
 *   - Max width size
 *   - Horizontal padding
 *   - Minimum height
 * @param {ReactNode} param0.children Children component to render
 * @param {SxProps} param0.sx MUI Styling props
 * @param {boolean} param0.isLoading Renders a loading spinner if true
 * @param {string} param0.loadingText Text to be rendered with the loading spinner
 * @param {boolean} param0.isError Renders an error page
 * @param {ROLES[]} param0.authorizedRoles An array of roles that are authorized to view a page. All roles can view the page if not provided.
 */
const Body: FC<Props> = ({
  children,
  sx,
  isLoading = false,
  loadingText,
  isError = false,
  authorizedRoles,
}) => {
  const router = useRouter();
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
    paddingBottom: "24px",
    maxWidth: WIDTH_XL,
    marginX: "auto",
    ...sx,
  };

  const requiresAuthorizationAndIsLoadingUser = Boolean(
    authorizedRoles && isLoadingUser
  );
  const isAuthorized =
    !authorizedRoles ||
    (authorizedRoles && user && userHasRole(user, authorizedRoles));

  const handleStopPreview = () => {
    stopPreview();
    router.push(PAGES.LANDING);
  };

  return (
    <>
      <Box sx={boxSx}>
        <LoadingWrapper
          isLoading={!!isLoading || requiresAuthorizationAndIsLoadingUser}
          loadingText={loadingText}
          fullScreen
        >
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
                onClick={handleStopPreview}
              >
                Stop Preview
              </Button>
            </Alert>
          )}
          <UnauthorizedWrapper isUnauthorized={!isAuthorized}>
            <ErrorWrapper isError={!!isError}>{children}</ErrorWrapper>
          </UnauthorizedWrapper>
        </LoadingWrapper>
      </Box>
    </>
  );
};
export default Body;
