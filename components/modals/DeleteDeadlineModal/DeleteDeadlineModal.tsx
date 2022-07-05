import { Dispatch, FC, SetStateAction } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Hooks
import useApiCall, { isCalling } from "@/hooks/useApiCall";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/pages/manage/deadlines";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deadline: Deadline;
  mutate: Mutate<GetDeadlinesResponse>;
  setSuccess: (message: string) => void;
  setError: (error: unknown) => void;
};

const DeleteDeadlineModal: FC<Props> = ({
  open,
  setOpen,
  deadline,
  mutate,
  setSuccess,
  setError,
}) => {
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
        subheader={`You are deleting the deadline ${deadline.name}. This action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
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
