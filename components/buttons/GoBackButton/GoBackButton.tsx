import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";

const GoBackButton: FC = () => {
  const router = useRouter();

  return (
    <Button
      color="primary"
      variant="outlined"
      sx={{ mb: "1rem" }}
      onClick={router.back}
    >
      <ArrowBack sx={{ mr: "0.25rem" }} />
      Back
    </Button>
  );
};
export default GoBackButton;
