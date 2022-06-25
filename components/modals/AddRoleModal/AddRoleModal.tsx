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
import { toSingular, ifUserAlreadyHasRole } from "@/helpers/roles";
import { processAddRoleFormValues } from "./AddRoleModal.helpers";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
import useCohort from "@/hooks/useCohort";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { User } from "@/types/users";
import { StudentMetadata } from "@/types/students";
import { AdviserMetadata } from "@/types/advisers";
import { MentorMetadata } from "@/types/mentors";
import { AdministratorMetadata } from "@/types/administrators";
import { ROLES } from "@/types/roles";
import { Cohort } from "@/types/cohorts";

export type AddRoleFormValuesType = Partial<StudentMetadata> &
  Partial<Omit<AdviserMetadata, "projectIds">> &
  Partial<Omit<MentorMetadata, "projectIds">> &
  Partial<AdministratorMetadata>;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
  mutate: Mutate<User[]>;
};

const AddRoleModal: FC<Props> = ({ open, setOpen, user, mutate }) => {
  const { cohorts, currentCohortYear } = useCohort();
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const [selectedRole, setSelectedRole] = useState<ROLES>(ROLES.STUDENTS);

  const addRole = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/users/${user.id}/${toSingular(selectedRole).toLowerCase()}`,
    requiresAuthorization: true,
    onSuccess: (newUser: User) => {
      mutate((users) => [...users, newUser]);
    },
  });

  const initialValues: AddRoleFormValuesType = {
    cohortYear: currentCohortYear,
  };

  const handleSubmit = async (
    values: AddRoleFormValuesType,
    actions: FormikHelpers<AddRoleFormValuesType>
  ) => {
    try {
      if (ifUserAlreadyHasRole(user, selectedRole)) {
        throw new Error(
          `${user.name} is already a ${toSingular(selectedRole)}`
        );
      }

      const processedValues = processAddRoleFormValues({
        values,
        role: selectedRole,
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
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                    cohorts={cohorts as Cohort[]}
                  />
                )}
                {selectedRole === ROLES.ADVISERS && (
                  <AdviserDetailsForm
                    formik={formik}
                    cohorts={cohorts as Cohort[]}
                  />
                )}
                {selectedRole === ROLES.MENTORS && (
                  <MentorDetailsForm
                    formik={formik}
                    cohorts={cohorts as Cohort[]}
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
