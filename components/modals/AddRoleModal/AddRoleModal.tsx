import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
// Components
import { MenuItem, TextField } from "@mui/material";
import SnackbarAlert from "@/components/layout/SnackbarAlert";
import Modal from "../Modal";
import { Button, Stack, Typography } from "@mui/material";
import StudentDetailsForm from "@/components/forms/StudentDetailsForm";
import AdviserDetailsForm from "@/components/forms/AdviserDetailsForm";
import MentorDetailsForm from "@/components/forms/MentorDetailsForm";
import AdministratorDetailsForm from "@/components/forms/AdministratorDetailsForm";
// Helpers
import { Formik, FormikHelpers } from "formik";
import {
  generateAddUserOrRoleEmptyInitialValues,
  getUserRoles,
  processAddUserOrRoleFormValues,
  toSingular,
  userHasRole,
} from "@/helpers/roles";
import { generateAddRoleValidationSchema } from "./AddRoleModal.helpers";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
import useCohort from "@/hooks/useCohort";
// Types
import { CreateRoleResponse, HTTP_METHOD } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { AddOrEditRoleFormValuesType, ROLES } from "@/types/roles";
import { Cohort } from "@/types/cohorts";
import { LeanProject } from "@/types/projects";
import { User } from "@/types/users";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
  mutate: Mutate<User[]>;
  leanProjects: LeanProject[] | undefined;
  isFetchingLeanProjects: boolean;
};

const AddRoleModal: FC<Props> = ({
  open,
  setOpen,
  user,
  mutate,
  leanProjects,
  isFetchingLeanProjects,
}) => {
  const { cohorts, currentCohortYear } = useCohort();
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const rolesThatUserDoesNotHave = Object.values(ROLES).filter(
    (role) => !getUserRoles(user).includes(role)
  );

  const [selectedRole, setSelectedRole] = useState<ROLES | null>(
    rolesThatUserDoesNotHave.length ? rolesThatUserDoesNotHave[0] : null
  );

  const addRole = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/users/${user.id}/${toSingular(selectedRole).toLowerCase()}`,
    requiresAuthorization: true,
    onSuccess: (response: CreateRoleResponse) => {
      mutate((users) => {
        const editedUserIdx = users.findIndex(({ id }) => id === user.id);
        const editedUser: User = { ...user, ...response };

        const editedUsers = [...users];
        editedUsers.splice(editedUserIdx, 1, editedUser);
        return editedUsers;
      });
      setSelectedRole(
        Object.values(ROLES).filter(
          (role) => !getUserRoles(user).includes(role)
        )[0] ?? null
      );
    },
  });

  const initialValues: AddOrEditRoleFormValuesType =
    generateAddUserOrRoleEmptyInitialValues(currentCohortYear, user);

  const handleSubmit = async (
    values: AddOrEditRoleFormValuesType,
    actions: FormikHelpers<AddOrEditRoleFormValuesType>
  ) => {
    try {
      if (!selectedRole) {
        throw new Error(`${user.name} already has all the roles`);
      } else if (userHasRole(user, selectedRole)) {
        throw new Error(
          `${user.name} is already a ${toSingular(selectedRole)}`
        );
      }

      const processedValues = processAddUserOrRoleFormValues({
        values,
        selectedRole,
        includeCohortYear: true,
      });

      await addRole.call(processedValues);
      setSuccess(
        `You have added the ${toSingular(selectedRole)} role to ${user.name}`
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
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Add Role`}
        subheader={`Adding ${toSingular(selectedRole)} role to ${user.name}`}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={generateAddRoleValidationSchema(selectedRole)}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <Typography>{`${toSingular(selectedRole)} Details`}</Typography>
                <TextField
                  label="Role"
                  value={selectedRole}
                  onChange={handleSelectedRoleChange}
                  select
                  size="small"
                >
                  {rolesThatUserDoesNotHave.map((role) => {
                    return (
                      <MenuItem key={role} value={role}>
                        {toSingular(role)}
                      </MenuItem>
                    );
                  })}
                </TextField>

                {selectedRole === ROLES.STUDENTS && (
                  <StudentDetailsForm
                    formik={formik}
                    cohorts={cohorts as Cohort[]}
                    leanProjects={leanProjects}
                    isFetchingLeanProjects={isFetchingLeanProjects}
                  />
                )}
                {selectedRole === ROLES.ADVISERS && (
                  <AdviserDetailsForm
                    formik={formik}
                    cohorts={cohorts as Cohort[]}
                    leanProjects={leanProjects}
                    isFetchingLeanProjects={isFetchingLeanProjects}
                  />
                )}
                {selectedRole === ROLES.MENTORS && (
                  <MentorDetailsForm
                    formik={formik}
                    cohorts={cohorts as Cohort[]}
                    leanProjects={leanProjects}
                    isFetchingLeanProjects={isFetchingLeanProjects}
                  />
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
export default AddRoleModal;
