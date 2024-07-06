import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { GetVoteEventVotesResponse, HTTP_METHOD } from "@/types/api";
import { Vote } from "@/types/voteEvents";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  voteEventId: number;
  vote: Vote;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventVotesResponse>;
};

const DeleteVoteModal: FC<Props> = ({
  voteEventId,
  vote,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const DeleteVote = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/vote-events/${voteEventId}/votes/${vote.id}`,
    onSuccess: () => {
      mutate((data) => {
        const newVotes = data.votes.filter((vote) => vote.id !== vote.id);
        return { votes: newVotes };
      });
    },
  });

  const handleDeleteVote = async () => {
    try {
      await DeleteVote.call();
      setSuccess(
        `You have successfully deleted a vote for project ID ${vote.projectId}!`
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
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title={`Delete Vote`}
      subheader={`You are deleting a vote for project ID ${vote.projectId}.\n\nThis action is irreversible, are you sure?`}
    >
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          id="delete-vote-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(DeleteVote.status)}
        >
          Cancel
        </Button>
        <Button
          id="delete-cvote-confirm-button"
          size="small"
          onClick={handleDeleteVote}
          variant="contained"
          color="error"
          disabled={isCalling(DeleteVote.status)}
        >
          Delete
        </Button>
      </Stack>
    </Modal>
  );
};
export default DeleteVoteModal;
