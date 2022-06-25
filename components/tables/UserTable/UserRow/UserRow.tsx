/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import Link from "next/link";
// Components
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import SnackbarAlert from "@/components/SnackbarAlert";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
import StudentTag from "@/components/tags/StudentTag";
import AdviserTag from "@/components/tags/AdviserTag";
import MentorTag from "@/components/tags/MentorTag";
import AddRoleTag from "@/components/tags/AddRoleTag";
import AdministratorTag from "@/components/tags/AdministratorTag";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { toSingular } from "@/helpers/roles";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { Mutate } from "@/hooks/useFetch";
// Types
import { User } from "@/types/users";

type Props = { user: User; mutate: Mutate<User[]> };

const UserRow: FC<Props> = ({ user, mutate }) => {
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const renderTags = () => {
    const tags = [];

    if (user.student && user.student.id !== undefined) {
      tags.push(
        <StudentTag
          key={user.student.id}
          studentRole={user.student}
          mutate={mutate}
        />
      );
    }
    if (user.adviser && user.adviser.id !== undefined) {
      tags.push(
        <AdviserTag
          key={user.adviser.id}
          adviserRole={user.adviser}
          mutate={mutate}
        />
      );
    }
    if (user.mentor && user.mentor.id !== undefined) {
      tags.push(
        <MentorTag
          key={user.mentor.id}
          mentorRole={user.mentor}
          mutate={mutate}
        />
      );
    }
    if (user.administrator && user.administrator.id !== undefined) {
      tags.push(
        <AdministratorTag
          key={user.administrator.id}
          administratorRole={user.administrator}
          mutate={mutate}
        />
      );
    }
    tags.push(<AddRoleTag key={user.id} user={user} mutate={mutate} />);
    return tags;
  };

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
        <TableCell>{renderTags()}</TableCell>
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
