import { FC, useState } from "react";
// Components
import { Button, Stack, Typography } from "@mui/material";
// Helpers
import { getRoleId, toSingular } from "@/helpers/roles";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { Mutate } from "@/hooks/useFetch";
import { HTTP_METHOD } from "@/types/api";
import { ROLES } from "@/types/roles";
import { RoleMetadata, User } from "@/types/users";

type Props = {
  user: User;
  selectedRole: ROLES | null;
  handleCloseModal: () => void;
  setViewMode: () => void;
  mutate: Mutate<User[]>;
};

const DeleteRole: FC<Props> = ({
  user,
  selectedRole,
  handleCloseModal,
  setViewMode,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteRole = useApiCall({
    method: HTTP_METHOD.DELETE,
    endpoint: `/${selectedRole?.toLowerCase()}/${getRoleId(
      user,
      selectedRole
    )}`,
    onSuccess: () => {
      mutate((users) => {
        const userId = user.id;
        const userIdx = users.findIndex((user) => user.id === userId);

        const newUserWithoutRole: User = { ...user };
        const removedRole = toSingular(
          selectedRole
        ).toLowerCase() as keyof RoleMetadata;
        delete newUserWithoutRole[removedRole];

        const newUsers = [...users];
        newUsers.splice(userIdx, 1, newUserWithoutRole);
        return newUsers;
      });
    },
  });

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteRole.call();
      setSuccess(
        `You have successfully deleted ${user.name}'s ${toSingular(
          selectedRole
        )} details!`
      );
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Stack direction="column" spacing="1rem">
        <Typography>{`You are deleting the ${toSingular(
          selectedRole
        )} role from ${user.name}`}</Typography>
        <Typography>{`Note that this will not delete the actual user, just remove the ${toSingular(
          selectedRole
        )} role from them`}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" marginTop="2rem">
        <Button size="small" onClick={setViewMode}>
          Back
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
    </>
  );
};
export default DeleteRole;
