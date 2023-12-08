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

interface RejectApplicationResponse {
  application: Application;
}

const RejectApplicationModal: FC<Props> = ({
  open,
  setOpen,
  application,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseModal = () => setOpen(false);

  const rejectApplication = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/application/reject/${application.submissionId}`,
    onSuccess: ({
      application: rejectedApplication,
    }: RejectApplicationResponse) => {
      mutate((applications) => {
        const rejectedSubmissionId = application.submissionId;
        const rejectedSubmissionIdx = applications.findIndex(
          (application) => application.submissionId === rejectedSubmissionId
        );
        const newApplications = [...applications];
        newApplications.splice(rejectedSubmissionIdx, 1, rejectedApplication);
        return newApplications;
      });
    },
  });

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await rejectApplication.call();
      setSuccess(
        `You have successfully rejected the application by ${application.teamName}!`
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
        title={`Reject Application`}
        subheader={`You are rejecting the application by team ${application.teamName}.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="confirm-reject-application-button"
            size="small"
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            Reject
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default RejectApplicationModal;
