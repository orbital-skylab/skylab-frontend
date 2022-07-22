import { Dispatch, FC, SetStateAction, useState } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { User } from "@/types/users";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
  mutate: Mutate<User[]>;
};

const DeleteUserModal: FC<Props> = ({ open, setOpen, user, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteUser = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/users/${user.id}`,
    onSuccess: () => {
      mutate((users) => {
        const deletedUserId = user.id;
        const deletedUserIdx = users.findIndex(
          (user) => user.id === deletedUserId
        );
        const newUsers = [...users];
        newUsers.splice(deletedUserIdx, 1);
        return newUsers;
      });
    },
  });

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteUser.call();
      setSuccess(`You have successfully deleted the user ${user.name}!`);
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Delete User`}
        subheader={`You are deleting user ${user.name}.\n\nThis action is irreversible, are you sure?`}
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
            disabled={isSubmitting}
          >
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
export default DeleteUserModal;
