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

interface ApproveApplicationResponse {
  application: Application;
}

const ApproveApplicationModal: FC<Props> = ({
  open,
  setOpen,
  application,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseModal = () => setOpen(false);

  const approveApplication = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/application/approve/${application.submissionId}`,
    onSuccess: ({
      application: approvedApplication,
    }: ApproveApplicationResponse) => {
      mutate((applications) => {
        const approvedSubmissionId = application.submissionId;
        const approvedSubmissionIdx = applications.findIndex(
          (application) => application.submissionId === approvedSubmissionId
        );
        const newApplications = [...applications];
        newApplications.splice(approvedSubmissionIdx, 1, approvedApplication);
        return newApplications;
      });
    },
  });

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await approveApplication.call();
      setSuccess(
        `You have successfully approved the application by ${application.teamName}!`
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
        title={`Approve Application`}
        subheader={`You are approving the application by team ${application.teamName}.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="confirm-approve-application-button"
            size="small"
            variant="contained"
            color="success"
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            Approve
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default ApproveApplicationModal;
