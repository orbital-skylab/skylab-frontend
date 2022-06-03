import { SNACKBAR_ALERT_INITIAL } from "@/helpers/forms";
import { SnackbarAlertType } from "@/types/forms";
import { Alert, Snackbar } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  snackbar: SnackbarAlertType;
  setSnackbar: Dispatch<SetStateAction<SnackbarAlertType>>;
};

const SnackbarAlert: FC<Props> = ({ snackbar, setSnackbar }) => {
  const handleCloseSnackbar = () => {
    setSnackbar(SNACKBAR_ALERT_INITIAL);
  };

  return (
    <Snackbar
      open={snackbar.message !== ""}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
    </Snackbar>
  );
};
export default SnackbarAlert;
