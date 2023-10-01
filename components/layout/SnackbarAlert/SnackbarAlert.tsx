import { AlertType } from "./SnackbarAlert.types";
import { Alert, Snackbar } from "@mui/material";
import { FC } from "react";

type Props = {
  alert: AlertType;
  handleClose: () => void;
};

const SnackbarAlert: FC<Props> = ({ alert, handleClose }) => {
  return (
    <Snackbar
      id={`${alert.severity}-alert`}
      open={alert.message !== ""}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={alert.severity} style={{ whiteSpace: "pre-wrap" }}>
        {alert.message}
      </Alert>
    </Snackbar>
  );
};
export default SnackbarAlert;
