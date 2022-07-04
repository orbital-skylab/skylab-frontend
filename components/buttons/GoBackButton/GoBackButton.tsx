import { ArrowBack } from "@mui/icons-material";
import { Button, SxProps } from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";

type Props = {
  sx: SxProps;
};

const GoBackButton: FC<Props> = ({ sx }) => {
  const router = useRouter();

  return (
    <Button
      color="primary"
      variant="outlined"
      sx={{ mb: "1rem", ...sx }}
      onClick={router.back}
    >
      <ArrowBack sx={{ mr: "0.25rem" }} />
      Back
    </Button>
  );
};
export default GoBackButton;
