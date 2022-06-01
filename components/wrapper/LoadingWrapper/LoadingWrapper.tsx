import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import { FULL_HEIGHT_MINUS_NAV } from "@/styles/constants";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";

type Props = {
  isLoading: boolean;
  loadingText?: string;
};

const LoadingWrapper: FC<Props> = ({ children, isLoading, loadingText }) => {
  if (isLoading) {
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
        <LoadingSpinner />
        <Typography variant="subtitle1">{loadingText}</Typography>
      </Box>
    );
  }

  return (
    <>
      <div>{children}</div>
    </>
  );
};
export default LoadingWrapper;
