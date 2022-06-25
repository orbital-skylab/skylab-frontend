import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
// Components
import Select from "@/components/formControllers/Select";
import { MenuItem, TextField } from "@mui/material";
import TextInput from "@/components/formControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import Modal from "../Modal";
import { Button, Stack, Typography } from "@mui/material";
import StudentDetailsForm from "@/components/forms/StudentDetailsForm";
import AdviserDetailsForm from "@/components/forms/AdviserDetailsForm";
import MentorDetailsForm from "@/components/forms/MentorDetailsForm";
// Helpers
import { Formik, FormikHelpers } from "formik";
import { processUserFormValues, toSingular } from "@/helpers/roles";
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
import { ROLES } from "@/types/roles";
import { Cohort } from "@/types/cohorts";

export type AddUserFormValuesType = Omit<UserMetadata, "id"> &
  Partial<StudentMetadata> &
  Partial<Omit<AdviserMetadata, "projectIds">> &
  Partial<Omit<MentorMetadata, "projectIds">> & { password?: string } & {
    cohortYear: Cohort["academicYear"];
  };

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
    const processedValues = processUserFormValues({
      values,
      role: selectedRole,
      withUser: true,
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
      setError(addUser.error);
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
                <TextInput
                  name="name"
                  label="Name"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  name="email"
                  type="email"
                  label="Email Address"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  name="password"
                  type="password"
                  label="Password (Optional)"
                  size="small"
                  formik={formik}
                />
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
                <Select
                  label="Cohort"
                  name="cohortYear"
                  options={cohorts.map((cohort) => ({
                    value: cohort.academicYear,
                    label: cohort.academicYear,
                  }))}
                  size="small"
                  formik={formik}
                />
                {selectedRole === ROLES.STUDENTS && (
                  <StudentDetailsForm formik={formik} />
                )}
                {selectedRole === ROLES.ADVISERS && (
                  <AdviserDetailsForm formik={formik} />
                )}
                {selectedRole === ROLES.MENTORS && (
                  <MentorDetailsForm formik={formik} />
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
