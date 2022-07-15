import { Dispatch, FC, SetStateAction, useState } from "react";
// Components
import SnackbarAlert from "@/components/layout/SnackbarAlert";
import Modal from "../Modal";
import ViewRole from "./ViewRole";
import EditRole from "./EditRole";
import DeleteRole from "./DeleteRole";

// Helpers
import { toSingular } from "@/helpers/roles";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
// Types
import { Mutate } from "@/hooks/useFetch";
import { User } from "@/types/users";
import { ROLES } from "@/types/roles";
import { LeanProject } from "@/types/projects";

enum MODE {
  VIEW,
  DELETE,
  EDIT,
}

type Props = {
  selectedRole: ROLES | null;
  setSelectedRole: Dispatch<SetStateAction<ROLES | null>>;
  user: User;
  mutate: Mutate<User[]>;
  leanProjects: LeanProject[] | undefined;
  isFetchingLeanProjects: boolean;
};

const ViewRoleModal: FC<Props> = ({
  selectedRole,
  setSelectedRole,
  user,
  mutate,
  leanProjects,
  isFetchingLeanProjects,
}) => {
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const [mode, setMode] = useState<MODE>(MODE.VIEW);

  const handleCloseModal = () => {
    setSelectedRole(null);
    setViewMode();
  };

  const setViewMode = () => {
    setMode(MODE.VIEW);
  };

  const setEditMode = () => {
    setMode(MODE.EDIT);
  };

  const setDeleteMode = () => {
    setMode(MODE.DELETE);
  };

  const renderMode = () => {
    switch (mode) {
      case MODE.VIEW:
        return (
          <ViewRole
            user={user}
            selectedRole={selectedRole}
            handleCloseModal={handleCloseModal}
            setEditMode={setEditMode}
            setDeleteMode={setDeleteMode}
          />
        );

      case MODE.EDIT:
        return (
          <EditRole
            user={user}
            selectedRole={selectedRole}
            handleCloseModal={handleCloseModal}
            setViewMode={setViewMode}
            setSuccess={setSuccess}
            setError={setError}
            mutate={mutate}
            leanProjects={leanProjects}
            isFetchingLeanProjects={isFetchingLeanProjects}
          />
        );

      case MODE.DELETE:
        return (
          <DeleteRole
            user={user}
            selectedRole={selectedRole}
            handleCloseModal={handleCloseModal}
            setViewMode={setViewMode}
            setSuccess={setSuccess}
            setError={setError}
            mutate={mutate}
          />
        );
    }
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
      <Modal
        open={Boolean(selectedRole)}
        handleClose={handleCloseModal}
        title={`${user.name}`}
        subheader={`You are viewing ${user.name}'s ${toSingular(
          selectedRole
        )} details`}
      >
        {renderMode()}
      </Modal>
    </>
  );
};
export default ViewRoleModal;
