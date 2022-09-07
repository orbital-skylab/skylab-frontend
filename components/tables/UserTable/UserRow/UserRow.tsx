import { FC, useState } from "react";
import Link from "next/link";
// Components
import {
  Button,
  Chip,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import ViewRoleModal from "@/components/modals/ViewRoleModal";
import AddRoleModal from "@/components/modals/AddRoleModal";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Hooks
import useAuth from "@/contexts/useAuth";
import { useRouter } from "next/router";
// Types
import { User } from "@/types/users";
import { ROLES } from "@/types/roles";
import { Mutate } from "@/hooks/useFetch";
import { LeanProject } from "@/types/projects";
import { BASE_TRANSITION } from "@/styles/constants";

type Props = {
  user: User;
  mutate: Mutate<User[]>;
  leanProjects: LeanProject[] | undefined;
  isFetchingLeanProjects: boolean;
};

const UserRow: FC<Props> = ({
  user,
  mutate,
  leanProjects,
  isFetchingLeanProjects,
}) => {
  const router = useRouter();
  const { previewSiteAs } = useAuth();
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ROLES | null>(null);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  const renderTags = () => {
    const tags = [];

    if (user.student && user.student.id !== undefined) {
      tags.push(
        <Chip
          key={"student" + user.student.id}
          label="Student"
          color="primary"
          size="small"
          onClick={() => setSelectedRole(ROLES.STUDENTS)}
        />
      );
    }
    if (user.adviser && user.adviser.id !== undefined) {
      tags.push(
        <Chip
          key={"adviser" + user.adviser.id}
          label="Adviser"
          color="secondary"
          size="small"
          onClick={() => setSelectedRole(ROLES.ADVISERS)}
        />
      );
    }
    if (user.mentor && user.mentor.id !== undefined) {
      tags.push(
        <Chip
          key={"mentor" + user.mentor.id}
          label="Mentor"
          color="info"
          size="small"
          onClick={() => setSelectedRole(ROLES.MENTORS)}
        />
      );
    }
    if (user.administrator && user.administrator.id !== undefined) {
      tags.push(
        <Chip
          key={"administrator" + user.administrator.id}
          label="Administrator"
          color="success"
          size="small"
          onClick={() => setSelectedRole(ROLES.ADMINISTRATORS)}
        />
      );
    }
    /** If the user does not have all the roles, place an Add (+) button */
    if (tags.length < Object.values(ROLES).length) {
      tags.push(
        <Chip
          key={"user" + user.id}
          label="+"
          size="small"
          variant="outlined"
          onClick={() => setIsAddRoleOpen(true)}
        />
      );
    }
    return tags;
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteUserOpen(true);
  };

  const handlePreviewSiteAs = () => {
    previewSiteAs(user);
    router.push(PAGES.LANDING);
  };

  return (
    <>
      <AddRoleModal
        open={isAddRoleOpen}
        setOpen={setIsAddRoleOpen}
        user={user}
        mutate={mutate}
        leanProjects={leanProjects}
        isFetchingLeanProjects={isFetchingLeanProjects}
      />
      <ViewRoleModal
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        user={user}
        mutate={mutate}
        leanProjects={leanProjects}
        isFetchingLeanProjects={isFetchingLeanProjects}
      />
      <DeleteUserModal
        open={isDeleteUserOpen}
        setOpen={setIsDeleteUserOpen}
        user={user}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.25rem">
            {renderTags()}
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Link href={`${PAGES.USERS}/${user.id}`} passHref>
              <Button>View</Button>
            </Link>
            <Link href={`${PAGES.USERS}/${user.id}/edit`} passHref>
              <Button>Edit</Button>
            </Link>
            <Tooltip title="Preview the website as this user and their role(s)">
              <Button onClick={handlePreviewSiteAs}>Preview</Button>
            </Tooltip>
            <Button
              onClick={handleOpenDeleteModal}
              sx={{
                transition: BASE_TRANSITION,
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
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
