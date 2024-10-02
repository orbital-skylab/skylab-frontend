import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  GetVotesResponse,
  HTTP_METHOD,
  SubmitVotesResponse,
} from "@/types/api";
import { Project } from "@/types/projects";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  voteEventId: number;
  selectedCandidates: { [key: number]: boolean };
  open: boolean;
  candidates: Project[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVotesResponse>;
};

const SubmitVotesModal: FC<Props> = ({
  voteEventId,
  selectedCandidates,
  open,
  candidates,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

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
  });

  const handleSubmit = async () => {
    try {
      await submitVotes.call({ projectIds });
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="submit-votes-modal"
      open={open}
      handleClose={handleCloseModal}
      title={`Submit Votes`}
      subheader={`Total votes: ${projectIds.length}\nYou have voted for the following projects:`}
    >
      <Stack marginBottom={2}>
        {projectIds.map((projectId) => (
          <Box key={projectId}>
            <Typography>
              {projectId +
                " - " +
                (candidates.find((candidate) => candidate.id === projectId)
                  ?.name || "")}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Stack spacing={2} direction="row" justifyContent="space-between">
        <Button
          id="submit-votes-return-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(submitVotes.status)}
        >
          return
        </Button>
        <LoadingButton
          id="submit-votes-button"
          size="small"
          onClick={handleSubmit}
          variant="contained"
          disabled={isCalling(submitVotes.status)}
          loading={isCalling(submitVotes.status)}
        >
          Submit
        </LoadingButton>
      </Stack>
    </Modal>
  );
};
export default SubmitVotesModal;
