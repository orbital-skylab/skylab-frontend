import { SNACKBAR_ALERT_INITIAL } from "@/helpers/forms";
import { SnackbarAlertType } from "@/types/forms";
import { useState } from "react";

const useSnackbarAlert = () => {
  const [snackbar, setSnackbar] = useState<SnackbarAlertType>(
    SNACKBAR_ALERT_INITIAL
  );

  const setSuccess = (message: string) => {
    setSnackbar({
      message,
      severity: "success",
    });
  };

  const setError = (error: unknown) => {
    if (typeof error === "string") {
      setSnackbar({
        message: error,
        severity: "error",
      });
    } else {
      setSnackbar({
        message: error instanceof Error ? error.message : String(error),
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    setSnackbar(SNACKBAR_ALERT_INITIAL);
  };

  return { snackbar, setSnackbar, setSuccess, setError, handleClose };
};
export default useSnackbarAlert;
