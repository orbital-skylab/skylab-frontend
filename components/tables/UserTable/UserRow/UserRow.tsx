/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import Link from "next/link";
// Components
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import SnackbarAlert from "@/components/SnackbarAlert";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import { Mutate } from "@/hooks/useFetch";
import { User } from "@/types/users";
import DeleteUserModal from "@/components/modals/DeleteUserModal";

type Props = { user: User; mutate: Mutate<User[]> };

const UserRow: FC<Props> = ({ user, mutate }) => {
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteUserOpen(true);
  };

  return (
    <>
      <DeleteUserModal
        open={isDeleteUserOpen}
        setOpen={setIsDeleteUserOpen}
        user={user}
        mutate={mutate}
        setSuccess={setSuccess}
        setError={setError}
      />
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <TableRow>
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>Roles Placeholder</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.5rem">
            <Link href={`${PAGES.PROFILE}/${user.email}`} passHref>
              <Button
                size="small"
                sx={{
                  "&:hover": {
                    color: "white",
                    backgroundColor: "info.main",
                  },
                }}
              >
                Profile
              </Button>
            </Link>
            <Button
              size="small"
              onClick={handleOpenDeleteModal}
              sx={{
                "&:hover": {
                  color: "white",
                  backgroundColor: "error.main",
                },
              }}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};
export default UserRow;
