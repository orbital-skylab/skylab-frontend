import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import { HTTP_METHOD } from "@/types/api";
import { Project } from "@/types/projects";
import { Stack, Button } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
  project: Project;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<Project[]>;
};

const DeleteProjectModal: FC<Props> = ({ project, open, setOpen, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const deleteProject = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/projects/${project.id}`,
    onSuccess: () => {
      mutate((projects) => {
        const deletedProjectId = project.id;
        const deletedProjectIdx = projects.findIndex(
          (project) => project.id === deletedProjectId
        );
        const newProjects = [...projects];
        newProjects.splice(deletedProjectIdx, 1);
        return newProjects;
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteProject.call();
      setSuccess(`You have successfully deleted the project ${project.name}!`);
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
        title={`Delete Project`}
        subheader={`You are deleting project ${project.name}.\n\nThis action is irreversible, are you sure?`}
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
            disabled={isCalling(deleteProject.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default DeleteProjectModal;
