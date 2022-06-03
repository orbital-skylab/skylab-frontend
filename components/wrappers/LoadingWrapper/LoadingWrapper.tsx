import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import { FULL_HEIGHT_MINUS_NAV } from "@/styles/constants";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";

type Props = {
  isLoading: boolean;
  loadingText?: string;
  fullScreen?: boolean;
};

const LoadingWrapper: FC<Props> = ({
  children,
  isLoading,
  loadingText,
  fullScreen,
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          height: fullScreen ? FULL_HEIGHT_MINUS_NAV : "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginY: fullScreen ? 0 : "15vh",
        }}
      >
        <LoadingSpinner />
        <Typography variant="subtitle1" fontWeight={600}>
          {loadingText}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};
export default LoadingWrapper;
