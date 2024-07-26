import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventsResponse, HTTP_METHOD } from "@/types/api";
import { VoteEvent } from "@/types/voteEvents";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";
import { LoadingButton } from "@mui/lab";

type Props = {
  voteEvent: VoteEvent;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventsResponse>;
};

const DeleteVoteEventModal: FC<Props> = ({
  voteEvent,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteVoteEvent = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/vote-events/${voteEvent.id}`,
    onSuccess: () => {
      mutate((data) => {
        const newVoteEvents = data.voteEvents.filter(
          (curVoteEvent) => curVoteEvent.id !== voteEvent.id
        );
        return { voteEvents: newVoteEvents };
      });
      setSuccess(
        `You have successfully deleted the vote event ${voteEvent.title}!`
      );
      handleCloseModal();
    },
    onError: () => {
      setError("Something went wrong while deleting the vote event");
    },
  });

  const handleDeleteVoteEvent = async () => {
    try {
      await deleteVoteEvent.call();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="delete-vote-event-modal"
      open={open}
      handleClose={handleCloseModal}
      title={`Delete Vote Event`}
      subheader={`You are deleting the vote event: ${voteEvent.title}.\n\nThis action is irreversible, are you sure?`}
    >
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          id="delete-vote-event-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(deleteVoteEvent.status)}
        >
          Cancel
        </Button>
        <LoadingButton
          id="delete-vote-event-confirm-button"
          size="small"
          onClick={handleDeleteVoteEvent}
          variant="contained"
          color="error"
          disabled={isCalling(deleteVoteEvent.status)}
          loading={isCalling(deleteVoteEvent.status)}
        >
          Delete
        </LoadingButton>
      </Stack>
    </Modal>
  );
};
export default DeleteVoteEventModal;
