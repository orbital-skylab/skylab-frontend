import { Dispatch, FC, SetStateAction, useState } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Hooks
import useApiCall from "@/hooks/useApiCall";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/pages/deadlines";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deadline: Deadline;
  mutate: Mutate<GetDeadlinesResponse>;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
};

const DeleteDeadlineModal: FC<Props> = ({
  open,
  setOpen,
  deadline,
  mutate,
  setSuccess,
  setError,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteDeadline = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/deadlines/${deadline.id}`,
    onSuccess: () => {
      mutate((data) => {
        const oldDeadlineIdx = data.deadlines.findIndex(
          (oldDeadline) => oldDeadline.id === deadline.id
        );
        const newDeadlines = [...data.deadlines];
        newDeadlines.splice(oldDeadlineIdx, 1);
        return { deadlines: newDeadlines };
      });
    },
  });

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteDeadline.call();
      setSuccess(
        `You have successfully deleted the deadline ${deadline.name}!`
      );
      handleCloseModal();
    } catch (error) {
      setError(deleteDeadline.error);
    }
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Delete Deadline`}
        subheader={`You are deleting deadline ${deadline.name}. This action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between" marginTop="-1rem">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
export default DeleteDeadlineModal;
