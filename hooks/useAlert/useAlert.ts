import { AlertType, ALERT_INITIAL } from "@/components/layout/SnackbarAlert";
import { useState } from "react";

const useAlert = () => {
  const [alert, setAlert] = useState<AlertType>(ALERT_INITIAL);

  const setInfo = (message: string) => {
    setAlert({
      message,
      severity: "info",
    });
  };

  const setSuccess = (message: string) => {
    setAlert({
      message,
      severity: "success",
    });
  };

  const setWarning = (message: string) => {
    setAlert({
      message,
      severity: "warning",
    });
  };

  const setError = (error: unknown) => {
    if (typeof error === "string") {
      setAlert({
        message: error,
        severity: "error",
      });
    } else {
      setAlert({
        message: error instanceof Error ? error.message : String(error),
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    setAlert(ALERT_INITIAL);
  };

  return {
    alert,
    setAlert,
    setInfo,
    setSuccess,
    setWarning,
    setError,
    handleClose,
  };
};
export default useAlert;
