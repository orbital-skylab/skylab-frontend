import {
  SnackbarAlertType,
  SNACKBAR_ALERT_INITIAL,
} from "@/components/SnackbarAlert";
import { useState } from "react";

const useSnackbarAlert = () => {
  const [snackbar, setSnackbar] = useState<SnackbarAlertType>(
    SNACKBAR_ALERT_INITIAL
  );

  const setInfo = (message: string) => {
    setSnackbar({
      message,
      severity: "info",
    });
  };

  const setSuccess = (message: string) => {
    setSnackbar({
      message,
      severity: "success",
    });
  };

  const setWarning = (message: string) => {
    setSnackbar({
      message,
      severity: "warning",
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

  return {
    snackbar,
    setSnackbar,
    setInfo,
    setSuccess,
    setWarning,
    setError,
    handleClose,
  };
};
export default useSnackbarAlert;
