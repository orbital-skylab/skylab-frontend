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

  const setError = (message: string) => {
    setSnackbar({
      message,
      severity: "error",
    });
  };

  const handleClose = () => {
    setSnackbar(SNACKBAR_ALERT_INITIAL);
  };

  return { snackbar, setSnackbar, setSuccess, setError, handleClose };
};
export default useSnackbarAlert;
