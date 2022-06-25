import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
// Components
import { MenuItem, TextField } from "@mui/material";
import SnackbarAlert from "@/components/SnackbarAlert";
import Modal from "../Modal";
import { Button, Stack, Typography } from "@mui/material";
import StudentDetailsForm from "@/components/forms/StudentDetailsForm";
import AdviserDetailsForm from "@/components/forms/AdviserDetailsForm";
import MentorDetailsForm from "@/components/forms/MentorDetailsForm";
import AdministratorDetailsForm from "@/components/forms/AdministratorDetailsForm";
// Helpers
import { Formik, FormikHelpers } from "formik";
import { toSingular } from "@/helpers/roles";
import { processAddUserFormValues } from "./AddUserModal.helpers";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { User, UserMetadata } from "@/types/users";
import { StudentMetadata } from "@/types/students";
import { AdviserMetadata } from "@/types/advisers";
import { MentorMetadata } from "@/types/mentors";
import { AdministratorMetadata } from "@/types/administrators";
import { ROLES } from "@/types/roles";
import { Cohort } from "@/types/cohorts";
import UserDetailsForm from "@/components/forms/UserDetailsForm";

export type AddUserFormValuesType = Omit<UserMetadata, "id"> & {
  password?: string;
} & Partial<StudentMetadata> &
  Partial<Omit<AdviserMetadata, "projectIds">> &
  Partial<Omit<MentorMetadata, "projectIds">> &
  Partial<AdministratorMetadata>;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cohorts: Cohort[];
  cohortYear: number;
  mutate: Mutate<User[]>;
  hasMore: boolean;
};

const AddUserModal: FC<Props> = ({
  open,
  setOpen,
  cohorts,
  cohortYear,
  mutate,
  hasMore,
}) => {
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const [selectedRole, setSelectedRole] = useState<ROLES>(ROLES.STUDENTS);

  const addUser = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/users/create-${toSingular(selectedRole).toLowerCase()}`,
    requiresAuthorization: true,
    onSuccess: (newUser: User) => {
      if (!hasMore) {
        mutate((users) => [...users, newUser]);
      }
    },
  });

  const initialValues: AddUserFormValuesType = {
    name: "",
    email: "",
    cohortYear,
  };

  const handleSubmit = async (
    values: AddUserFormValuesType,
    actions: FormikHelpers<AddUserFormValuesType>
  ) => {
    const processedValues = processAddUserFormValues({
      values,
      role: selectedRole,
    });

    try {
      await addUser.call(processedValues);
      setSuccess(
        `You have successfully created a new ${toSingular(selectedRole)}: ${
          values.name
        }`
      );
      handleCloseModal();
      actions.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSelectedRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(e.target.value as ROLES);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
      <Modal open={open} handleClose={handleCloseModal} title={`Add User`}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <Typography>User Details</Typography>
                <UserDetailsForm formik={formik} />
                <Typography>{`${toSingular(selectedRole)} Details`}</Typography>
                <TextField
                  label="Role"
                  value={selectedRole}
                  onChange={handleSelectedRoleChange}
                  select
                  size="small"
                >
                  {Object.values(ROLES).map((role) => {
                    return (
                      <MenuItem key={role} value={role}>
                        {toSingular(role)}
                      </MenuItem>
                    );
                  })}
                </TextField>

                {selectedRole === ROLES.STUDENTS && (
                  <StudentDetailsForm formik={formik} cohorts={cohorts} />
                )}
                {selectedRole === ROLES.ADVISERS && (
                  <AdviserDetailsForm formik={formik} cohorts={cohorts} />
                )}
                {selectedRole === ROLES.MENTORS && (
                  <MentorDetailsForm formik={formik} cohorts={cohorts} />
                )}
                {selectedRole === ROLES.ADMINISTRATORS && (
                  <AdministratorDetailsForm formik={formik} />
                )}
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                marginTop="2rem"
              >
                <Button size="small" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting}
                >
                  Add
                </Button>
              </Stack>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default AddUserModal;
