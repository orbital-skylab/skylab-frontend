import { Dispatch, FC, SetStateAction } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Hooks
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { HTTP_METHOD, GetDeadlinesResponse } from "@/types/api";
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deadline: Deadline;
  mutate: Mutate<GetDeadlinesResponse>;
};

const DeleteDeadlineModal: FC<Props> = ({
  open,
  setOpen,
  deadline,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

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
    try {
      await deleteDeadline.call();
      setSuccess(
        `You have successfully deleted the deadline ${deadline.name}!`
      );
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
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
        subheader={`You are deleting the deadline ${deadline.name}.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            id="delete-deadline-confirm-button"
            size="small"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isCalling(deleteDeadline.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
export default DeleteDeadlineModal;
