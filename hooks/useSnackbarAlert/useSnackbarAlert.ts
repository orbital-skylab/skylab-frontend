import { SNACKBAR_ALERT_INITIAL } from "@/helpers/forms";
import { SnackbarAlertType } from "@/types/forms";
import { Dispatch, SetStateAction, useState } from "react";

const useSnackbarAlert = () => {
  const [snackbar, setSnackbar] = useState<SnackbarAlertType>(
    SNACKBAR_ALERT_INITIAL
  );

  const res: [SnackbarAlertType, Dispatch<SetStateAction<SnackbarAlertType>>] =
    [snackbar, setSnackbar];
  return res;
};
export default useSnackbarAlert;
