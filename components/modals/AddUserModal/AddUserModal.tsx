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
import UserDetailsForm from "@/components/forms/UserDetailsForm";
// Helpers
import { Formik, FormikHelpers } from "formik";
import {
  generateEmptyInitialValues,
  processAddUserOrRoleFormValues,
  toSingular,
} from "@/helpers/roles";
import { generateValidationSchema } from "./AddUserModal.helpers";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { User } from "@/types/users";
import { CreateUserResponse } from "@/types/api";
import { AddUserFormValuesType, ROLES } from "@/types/roles";
import { LeanProject } from "@/types/projects";
import useCohort from "@/hooks/useCohort";
import { useRouter } from "next/router";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<User[]>;
  hasMore: boolean;
  leanProjects: LeanProject[] | undefined;
  isFetchingLeanProjects: boolean;
};

const AddUserModal: FC<Props> = ({
  open,
  setOpen,
  // TODO: Fix Jira Ticket 117
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasMore,
  leanProjects,
  isFetchingLeanProjects,
}) => {
  const router = useRouter();
  const { cohorts, currentCohortYear } = useCohort();
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const [selectedRole, setSelectedRole] = useState<ROLES>(ROLES.STUDENTS);

  const addUser = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/${selectedRole.toLowerCase()}`,
    requiresAuthorization: true,
    // TODO: Fix Jira Ticket 117
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (newUser: CreateUserResponse) => {
      setTimeout(() => {
        router.reload();
      }, 3000);
    },
  });

  const initialValues: AddUserFormValuesType =
    generateEmptyInitialValues(currentCohortYear);

  const handleSubmit = async (
    values: AddUserFormValuesType,
    actions: FormikHelpers<AddUserFormValuesType>
  ) => {
    const processedValues = processAddUserOrRoleFormValues({
      values,
      selectedRole,
      includeUserData: true,
      includeCohortYear: true,
    });

    try {
      await addUser.call(processedValues);
      setSuccess(
        `You have successfully created a new ${toSingular(selectedRole)}: ${
          values.name
        }. Refreshing in 3 seconds...`
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
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={generateValidationSchema(selectedRole)}
        >
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
                  <StudentDetailsForm
                    formik={formik}
                    cohorts={cohorts}
                    leanProjects={leanProjects}
                    isFetchingLeanProjects={isFetchingLeanProjects}
                  />
                )}
                {selectedRole === ROLES.ADVISERS && (
                  <AdviserDetailsForm
                    formik={formik}
                    cohorts={cohorts}
                    leanProjects={leanProjects}
                    isFetchingLeanProjects={isFetchingLeanProjects}
                  />
                )}
                {selectedRole === ROLES.MENTORS && (
                  <MentorDetailsForm
                    formik={formik}
                    cohorts={cohorts}
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
export default AddUserModal;
