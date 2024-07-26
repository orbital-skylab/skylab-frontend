import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { GetExternalVotersResponse, HTTP_METHOD } from "@/types/api";
import { ExternalVoter } from "@/types/voteEvents";
import { Button, Stack } from "@mui/material";
import { Mutate } from "@/hooks/useFetch";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";
import { LoadingButton } from "@mui/lab";

type Props = {
  externalVoter: ExternalVoter;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetExternalVotersResponse>;
};

const DeleteExternalVoterModal: FC<Props> = ({
  externalVoter,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const DeleteExternalVoter = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/vote-events/${externalVoter.voteEventId}/voter-management/external-voters/${externalVoter.id}`,
    onSuccess: () => {
      mutate((data) => {
        const newExternalVoters = data.externalVoters.filter(
          (voter) => voter.id !== externalVoter.id
        );
        return { externalVoters: newExternalVoters };
      });
      setSuccess(
        `You have successfully deleted the external voter ${externalVoter.id}!`
      );
      handleCloseModal();
    },
  });

  const handleDeleteExternalVoter = async () => {
    try {
      await DeleteExternalVoter.call();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="delete-external-voter-modal"
      open={open}
      handleClose={handleCloseModal}
      title={`Delete External Voter`}
      subheader={`You are deleting the external voter ${externalVoter.id}.\n\nThis action is irreversible, are you sure?`}
    >
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          id="delete-external-voter-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(DeleteExternalVoter.status)}
        >
          Cancel
        </Button>
        <LoadingButton
          id="delete-external-voter-confirm-button"
          size="small"
          onClick={handleDeleteExternalVoter}
          variant="contained"
          color="error"
          disabled={isCalling(DeleteExternalVoter.status)}
          loading={isCalling(DeleteExternalVoter.status)}
        >
          Delete
        </LoadingButton>
      </Stack>
    </Modal>
  );
};
export default DeleteExternalVoterModal;
