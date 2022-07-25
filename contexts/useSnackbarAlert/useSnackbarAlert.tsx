import SnackbarAlert, {
  AlertType,
  ALERT_INITIAL,
} from "@/components/layout/SnackbarAlert";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";

type ISnackbarAlert = {
  setInfo: (message: string) => void;
  setSuccess: (message: string) => void;
  setWarning: (message: string) => void;
  setError: (error: unknown) => void;
};

const SnackbarAlertContext = createContext<ISnackbarAlert>({
  setInfo: () => {
    /** Function placeholder */
  },
  setSuccess: () => {
    /** Function placeholder */
  },
  setWarning: () => {
    /** Function placeholder */
  },
  setError: () => {
    /** Function placeholder */
  },
});

/**
 * A context for snackbar alerts (essentially notifications/popups).
 * Best used for success or error messages upon making API calls or
 */
export const SnackbarAlertProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [alert, setAlert] = useState<AlertType>(ALERT_INITIAL);

  const setInfo = (message: string) => {
    setAlert({ message, severity: "info" });
  };

  const setSuccess = (message: string) => {
    setAlert({ message, severity: "success" });
  };

  const setWarning = (message: string) => {
    setAlert({ message, severity: "warning" });
  };

  const setError = (error: unknown) => {
    if (typeof error === "string") {
      setAlert({ message: error, severity: "error" });
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

  const memoedValue = useMemo(
    () => ({
      setInfo,
      setSuccess,
      setWarning,
      setError,
    }),
    []
  );

  return (
    <SnackbarAlertContext.Provider value={memoedValue}>
      <SnackbarAlert alert={alert} handleClose={handleClose} />
      {children}
    </SnackbarAlertContext.Provider>
  );
};

export default function useSnackbarAlert() {
  return useContext(SnackbarAlertContext);
}
