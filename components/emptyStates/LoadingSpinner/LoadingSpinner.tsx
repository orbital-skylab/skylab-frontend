import { CircularProgress } from "@mui/material";
import { FC } from "react";

const LoadingSpinner: FC = () => {
  return <CircularProgress size={90} thickness={1.5} />;
};
export default LoadingSpinner;
