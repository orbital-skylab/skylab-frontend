import { CircularProgress } from "@mui/material";
import { FC } from "react";

type Props = {
  size?: number;
};

const LoadingSpinner: FC<Props> = ({ size = 90 }) => {
  return <CircularProgress size={size} thickness={1.5} />;
};
export default LoadingSpinner;
