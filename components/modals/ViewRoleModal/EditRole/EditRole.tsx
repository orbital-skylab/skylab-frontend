import { FC } from "react";
// Components
import { Box, Button, Stack, Typography } from "@mui/material";
import UserDetails from "@/components/details/UserDetails";
import AdministratorDetailsForm from "@/components/forms/AdministratorDetailsForm";
import AdviserDetailsForm from "@/components/forms/AdviserDetailsForm";
import MentorDetailsForm from "@/components/forms/MentorDetailsForm";
import StudentDetailsForm from "@/components/forms/StudentDetailsForm";
// Helpers
import {
  generateInitialValues,
  generateEditRoleValidationSchema,
} from "./EditRole.helpers";
import { Formik, FormikHelpers, FormikProps } from "formik";
import {
  getRoleId,
  processAddUserOrRoleFormValues,
  toSingular,
} from "@/helpers/roles";
// Hooks
import useApiCall from "@/hooks/useApiCall";
// Types
import { Mutate } from "@/hooks/useFetch";
import { EditRoleResponse, HTTP_METHOD } from "@/types/api";
import { AddOrEditRoleFormValuesType, ROLES } from "@/types/roles";
import { User } from "@/types/users";
import { LeanProject } from "@/types/projects";
import { LoadingButton } from "@mui/lab";

type Props = {
  user: User;
  selectedRole: ROLES | null;
  handleCloseModal: () => void;
  setViewMode: () => void;
  setSuccess: (message: string) => void;
  setError: (error: unknown) => void;
  mutate: Mutate<User[]>;
  leanProjects: LeanProject[] | undefined;
  isFetchingLeanProjects: boolean;
};

const EditRole: FC<Props> = ({
  user,
  selectedRole,
  handleCloseModal,
  setViewMode,
  setSuccess,
  setError,
  mutate,
  leanProjects,
  isFetchingLeanProjects,
}) => {
  const editRole = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/${selectedRole?.toLowerCase()}/${getRoleId(
      user,
      selectedRole
    )}`,
    requiresAuthorization: true,
    onSuccess: (response: EditRoleResponse) => {
      mutate((users) => {
        const editedUserIdx = users.findIndex(({ id }) => id === user.id);
        const editedUser: User = { ...user, ...response };

        const editedUsers = [...users];
        editedUsers.splice(editedUserIdx, 1, editedUser);
        return editedUsers;
      });
    },
  });

  const initialValues: AddOrEditRoleFormValuesType = generateInitialValues({
    user,
    selectedRole,
  });

  const handleSubmit = async (
    values: AddOrEditRoleFormValuesType,
    actions: FormikHelpers<AddOrEditRoleFormValuesType>
  ) => {
    const processedValues = processAddUserOrRoleFormValues({
      values,
      selectedRole,
    });
    try {
      await editRole.call(processedValues);
      setSuccess(
        `You have successfully edited ${user.name}'s ${toSingular(
          selectedRole
        )} details!`
      );
      handleCloseModal();
      actions.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const renderRoleDetailsForm = (
    formik: FormikProps<AddOrEditRoleFormValuesType>
  ) => {
    switch (selectedRole) {
      case ROLES.STUDENTS:
        return (
          <StudentDetailsForm
            formik={formik}
            leanProjects={leanProjects}
            isFetchingLeanProjects={isFetchingLeanProjects}
          />
        );
      case ROLES.ADVISERS:
        return (
          <AdviserDetailsForm
            formik={formik}
            leanProjects={leanProjects}
            isFetchingLeanProjects={isFetchingLeanProjects}
          />
        );
      case ROLES.MENTORS:
        return (
          <MentorDetailsForm
            formik={formik}
            leanProjects={leanProjects}
            isFetchingLeanProjects={isFetchingLeanProjects}
          />
        );
      case ROLES.ADMINISTRATORS:
        return <AdministratorDetailsForm formik={formik} />;
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={generateEditRoleValidationSchema(selectedRole)}
    >
      {(formik) => (
        <>
          <Stack direction="column" spacing="1rem">
            <Box>
              <Typography fontWeight={600} mb="0.25rem">
                User Details
              </Typography>
              <UserDetails user={user} />
            </Box>

            <Typography fontWeight={600} mb="0.25rem">{`Edit ${toSingular(
              selectedRole
            )} Details`}</Typography>
            {renderRoleDetailsForm(formik)}
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            marginTop="2rem"
          >
            <Button size="small" onClick={setViewMode}>
              Back
            </Button>
            <LoadingButton
              size="small"
              variant="contained"
              color="warning"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
              loading={formik.isSubmitting}
            >
              Save
            </LoadingButton>
          </Stack>
        </>
      )}
    </Formik>
  );
};
export default EditRole;
