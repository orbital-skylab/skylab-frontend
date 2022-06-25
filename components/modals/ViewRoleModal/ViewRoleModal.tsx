import { Dispatch, FC, SetStateAction, useState } from "react";
// Components
import SnackbarAlert from "@/components/SnackbarAlert";
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

enum MODE {
  VIEW,
  DELETE,
  EDIT,
}

type Props = {
  viewSelectedRole: ROLES | null;
  setViewSelectedRole: Dispatch<SetStateAction<ROLES | null>>;
  user: User;
  mutate: Mutate<User[]>;
};

const ViewRoleModal: FC<Props> = ({
  viewSelectedRole,
  setViewSelectedRole,
  user,
  mutate,
}) => {
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const [mode, setMode] = useState<MODE>(MODE.VIEW);

  const handleCloseModal = () => {
    setViewSelectedRole(null);
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
            viewSelectedRole={viewSelectedRole}
            handleCloseModal={handleCloseModal}
            setEditMode={setEditMode}
            setDeleteMode={setDeleteMode}
          />
        );

      case MODE.EDIT:
        return (
          <EditRole
            user={user}
            viewSelectedRole={viewSelectedRole}
            handleCloseModal={handleCloseModal}
            setViewMode={setViewMode}
            setSuccess={setSuccess}
            setError={setError}
            mutate={mutate}
          />
        );

      case MODE.DELETE:
        return (
          <DeleteRole
            user={user}
            viewSelectedRole={viewSelectedRole}
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
        open={Boolean(viewSelectedRole)}
        handleClose={handleCloseModal}
        title={`${user.name}`}
        subheader={`You are viewing ${user.name}'s ${toSingular(
          viewSelectedRole
        )} details`}
      >
        {renderMode()}
      </Modal>
    </>
  );
};
export default ViewRoleModal;
