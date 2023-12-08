import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { HTTP_METHOD } from "@/types/api";
import { Application } from "@/types/applications";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  application: Application;
  mutate: Mutate<Application[]>;
};

const WithdrawApplicationModal: FC<Props> = ({
  open,
  setOpen,
  application,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseModal = () => setOpen(false);

  const withdrawApplication = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/application/${application.submissionId}`,
    onSuccess: () => {
      mutate((applications) => {
        const deletedSubmissionId = application.submissionId;
        const deletedSubmissionIdx = applications.findIndex(
          (application) => application.submissionId === deletedSubmissionId
        );
        const newApplications = [...applications];
        newApplications.splice(deletedSubmissionIdx, 1);
        return newApplications;
      });
    },
  });

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    try {
      await withdrawApplication.call();
      setSuccess(
        `You have successfully withdrawn the application by ${application.teamName}!`
      );
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Withdraw Application`}
        subheader={`You are withdrawing the application by team ${application.teamName}.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="confirm-withdraw-application-button"
            size="small"
            variant="contained"
            color="error"
            onClick={handleWithdraw}
            disabled={isSubmitting}
          >
            Withdraw
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default WithdrawApplicationModal;
