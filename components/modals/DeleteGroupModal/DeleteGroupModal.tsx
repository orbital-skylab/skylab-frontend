import { Dispatch, FC, SetStateAction } from "react";
// Components
import { Stack, Button } from "@mui/material";
import Modal from "../Modal";
// Hook
import useApiCall, { isCalling } from "@/hooks/useApiCall";
// Types
import { Mutate } from "@/hooks/useFetch";
import { GetProjectsResponse, HTTP_METHOD } from "@/types/api";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  groupId: number;
  mutate: Mutate<GetProjectsResponse>;
  setSuccess: (message: string) => void;
  setError: (error: unknown) => void;
};

const DeleteGroupModal: FC<Props> = ({
  open,
  setOpen,
  groupId,
  mutate,
  setSuccess,
  setError,
}) => {
  const deleteGroup = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `TODO:`,
    onSuccess: () => {
      mutate(({ projects }) => {
        const newProjects = [...projects];
        newProjects.map((project) => {
          if (project.groupId === groupId) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { groupId, ...projectWithoutGroupId } = project;
            return projectWithoutGroupId;
          }
          return project;
        });
        return { projects: newProjects };
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteGroup.call();
      setSuccess(`You have successfully deleted the group ${groupId}!`);
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
        title={`Delete Group`}
        subheader={`You are deleting group ${groupId}. This action is irreversible, are you sure? Note that only the evaluation group will be deleted but the projects will not be deleted.`}
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
            disabled={isCalling(deleteGroup.status)}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default DeleteGroupModal;
