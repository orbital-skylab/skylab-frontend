import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { GetInternalVotersResponse, HTTP_METHOD } from "@/types/api";
import { User } from "@/types/users";
import { Button, Stack } from "@mui/material";
import { Mutate } from "@/hooks/useFetch";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  voteEventId: number;
  internalVoter: User;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetInternalVotersResponse>;
};

const DeleteInternalVoterModal: FC<Props> = ({
  voteEventId,
  internalVoter,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const DeleteInternalVoter = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/vote-events/${voteEventId}/voter-management/internal-voters/${internalVoter.id}`,
    onSuccess: () => {
      mutate((data) => {
        const newInternalVoters = data.internalVoters.filter(
          (voter) => voter.id !== internalVoter.id
        );
        return { internalVoters: newInternalVoters };
      });
      setSuccess(
        `You have successfully deleted the internal voter ${internalVoter.email}!`
      );
      handleCloseModal();
    },
  });

  const handleDeleteInternalVoter = async () => {
    try {
      await DeleteInternalVoter.call();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="delete-internal-voter-modal"
      open={open}
      handleClose={handleCloseModal}
      title={`Delete Internal Voter`}
      subheader={`You are deleting the internal voter ${internalVoter.email}.\n\nThis action is irreversible, are you sure?`}
    >
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          id="delete-internal-voter-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(DeleteInternalVoter.status)}
        >
          Cancel
        </Button>
        <Button
          id="delete-internal-voter-confirm-button"
          size="small"
          onClick={handleDeleteInternalVoter}
          variant="contained"
          color="error"
          disabled={isCalling(DeleteInternalVoter.status)}
        >
          Delete
        </Button>
      </Stack>
    </Modal>
  );
};
export default DeleteInternalVoterModal;
