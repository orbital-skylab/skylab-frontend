import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { GetCandidatesResponse, HTTP_METHOD } from "@/types/api";
import { Project } from "@/types/projects";
import { Button, Stack } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  voteEventId: number;
  candidate: Project;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetCandidatesResponse>;
};

const DeleteCandidateModal: FC<Props> = ({
  voteEventId,
  candidate,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const DeleteCandidate = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/vote-events/${voteEventId}/candidates/${candidate.id}`,
    onSuccess: () => {
      mutate((data) => {
        const newCandidates = data.candidates.filter(
          (project) => project.id !== candidate.id
        );
        return { candidates: newCandidates };
      });
    },
  });

  const handleDeleteCandidate = async () => {
    try {
      await DeleteCandidate.call();
      setSuccess(
        `You have successfully deleted the candidate with id ${candidate.id}!`
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
      title={`Delete Candidate`}
      subheader={`You are deleting the candidate with id ${candidate.id}.\n\nThis action is irreversible, are you sure?`}
    >
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          id="delete-candidate-cancel-button"
          size="small"
          onClick={handleCloseModal}
          disabled={isCalling(DeleteCandidate.status)}
        >
          Cancel
        </Button>
        <Button
          id="delete-candidate-confirm-button"
          size="small"
          onClick={handleDeleteCandidate}
          variant="contained"
          color="error"
          disabled={isCalling(DeleteCandidate.status)}
        >
          Delete
        </Button>
      </Stack>
    </Modal>
  );
};
export default DeleteCandidateModal;
