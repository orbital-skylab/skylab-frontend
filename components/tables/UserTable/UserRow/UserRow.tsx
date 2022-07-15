import { FC, MouseEvent, useState } from "react";
import Link from "next/link";
// Components
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import SnackbarAlert from "@/components/layout/SnackbarAlert";
import ViewRoleModal from "@/components/modals/ViewRoleModal";
import AddRoleModal from "@/components/modals/AddRoleModal";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { Mutate } from "@/hooks/useFetch";
// Types
import { User } from "@/types/users";
import { ROLES } from "@/types/roles";
import { LeanProject } from "@/types/projects";
import { KeyboardArrowDown } from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";
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
  const { previewSiteAs } = useAuth();
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();
  const [dropdownAnchorElement, setDropdownAnchorElement] =
    useState<HTMLElement | null>(null);
  const isDropdownOpen = Boolean(dropdownAnchorElement);
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

  const handleOpenDropdown = (e: MouseEvent<HTMLButtonElement>) => {
    setDropdownAnchorElement(e.currentTarget);
  };

  const handleCloseDropdown = () => {
    setDropdownAnchorElement(null);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteUserOpen(true);
  };

  const handlePreviewSiteAs = () => {
    previewSiteAs(user);
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
        setSuccess={setSuccess}
        setError={setError}
      />
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <TableRow>
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.25rem">
            {renderTags()}
          </Stack>
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenDropdown}
            endIcon={<KeyboardArrowDown />}
          >
            Options
          </Button>
          <Menu
            anchorEl={dropdownAnchorElement}
            open={isDropdownOpen}
            onClose={handleCloseDropdown}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Link href={`${PAGES.USERS}/${user.id}`} passHref>
              <MenuItem>View Profile</MenuItem>
            </Link>
            <MenuItem onClick={handlePreviewSiteAs}>Preview</MenuItem>
            <MenuItem
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
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    </>
  );
};
export default UserRow;
