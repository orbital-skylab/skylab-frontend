import Modal from "@/components/modals/Modal";
import useAuth from "@/contexts/useAuth";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  GetVotesResponse,
  HTTP_METHOD,
  SubmitVotesResponse,
} from "@/types/api";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  voteEventId: number;
  selectedCandidates: { [key: number]: boolean };
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVotesResponse>;
};

const SubmitVotesModal: FC<Props> = ({
  voteEventId,
  selectedCandidates,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const { user } = useAuth();

  const projectIds = Object.entries(selectedCandidates)
    .filter(([, isSelected]) => isSelected)
    .map(([projectId]) => parseInt(projectId));

  const submitVotes = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events/${voteEventId}/votes`,
    onSuccess: ({ votes }: SubmitVotesResponse) => {
      mutate(() => {
        return {
          votes: votes,
        };
      });
      setSuccess("Submitted successfully");
      handleCloseModal();
    },
    onError: () => {
      setError("Something went wrong while submitting votes");
    },
  });

  const handleSubmit = async () => {
    try {
      await submitVotes.call(
        user
          ? {
              userId: user.id,
              projectIds,
            }
          : {
              externalVoterId: "not used yet",
              projectIds,
            }
      );
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
      title={`Submit Votes`}
      subheader={`Total votes: ${
        projectIds.length
      }\nYou have voted for the following projects: ${projectIds.join(", ")}`}
    >
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          id="delete-vote-event-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(submitVotes.status)}
        >
          return
        </Button>
        <Button
          id="delete-vote-event-confirm-button"
          size="small"
          onClick={handleSubmit}
          variant="contained"
          disabled={isCalling(submitVotes.status)}
        >
          Submit
        </Button>
      </Stack>
    </Modal>
  );
};
export default SubmitVotesModal;
