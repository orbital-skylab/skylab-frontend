import { SnackbarAlertType } from "@/types/forms";
import { Alert, Snackbar } from "@mui/material";
import { FC } from "react";

type Props = {
  snackbar: SnackbarAlertType;
  handleClose: () => void;
};

const SnackbarAlert: FC<Props> = ({ snackbar, handleClose }) => {
  return (
    <Snackbar
      open={snackbar.message !== ""}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
    </Snackbar>
  );
};
export default SnackbarAlert;
