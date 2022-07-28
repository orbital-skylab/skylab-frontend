import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { HTTP_METHOD } from "@/types/api";
import { Team } from "@/types/teams";
import { Stack, Button } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  team: Team;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<Team[]>;
};

const DeleteTeamModal: FC<Props> = ({ team, open, setOpen, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteTeam = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/teams/${team.id}`,
    onSuccess: () => {
      mutate((teams) => {
        const deletedTeamId = team.id;
        const deletedTeamIdx = teams.findIndex(
          (team) => team.id === deletedTeamId
        );
        const newTeams = [...teams];
        newTeams.splice(deletedTeamIdx, 1);
        return newTeams;
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteTeam.call();
      setSuccess(`You have successfully deleted the team ${team.name}!`);
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
        title={`Delete Team`}
        subheader={`You are deleting team ${team.name}.\n\nThis action is irreversible, are you sure?`}
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
            disabled={isCalling(deleteTeam.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default DeleteTeamModal;
