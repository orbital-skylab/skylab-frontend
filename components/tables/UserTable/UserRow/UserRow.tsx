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

type Props = { user: User; mutate: Mutate<User[]> };

const UserRow: FC<Props> = ({ user, mutate }) => {
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditUserOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteUserOpen(true);
  };

  return (
    <>
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
              onClick={handleOpenEditModal}
              sx={{
                "&:hover": {
                  color: "white",
                  backgroundColor: "warning.main",
                },
              }}
            >
              Edit
            </Button>
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
