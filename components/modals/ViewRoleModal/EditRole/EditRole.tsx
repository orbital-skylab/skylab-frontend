import { FC } from "react";
// Components
import { Box, Button, Stack, Typography } from "@mui/material";
import UserDetails from "@/components/details/UserDetails";
import AdministratorDetailsForm from "@/components/forms/AdministratorDetailsForm";
import AdviserDetailsForm from "@/components/forms/AdviserDetailsForm";
import MentorDetailsForm from "@/components/forms/MentorDetailsForm";
import StudentDetailsForm from "@/components/forms/StudentDetailsForm";
// Helpers
import { generateInitialValues } from "./EditRole.helpers";
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
import { HTTP_METHOD } from "@/types/api";
import { AddOrEditRoleFormValuesType, ROLES } from "@/types/roles";
import { RoleMetadata, User } from "@/types/users";
import { LeanProject } from "@/types/projects";
import { generateValidationSchema } from "../../AddRoleModal";

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
    // TODO: Check newRoleDetails type
    onSuccess: (newRoleDetails) => {
      mutate((users) => {
        const userId = user.id;
        const userIdx = users.findIndex((user) => user.id === userId);

        const newUserWithEditedRole: User = { ...user };
        const editedRole = toSingular(
          selectedRole
        ).toLowerCase() as keyof RoleMetadata;
        newUserWithEditedRole[editedRole] = {
          ...newUserWithEditedRole[editedRole],
          ...newRoleDetails,
        };

        const newUsers = [...users];
        newUsers.splice(userIdx, 1, newUserWithEditedRole);
        return newUsers;
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
      validationSchema={generateValidationSchema(selectedRole)}
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
            <Button
              size="small"
              variant="contained"
              color="warning"
              onClick={formik.submitForm}
              disabled={formik.isSubmitting}
            >
              Edit
            </Button>
          </Stack>
        </>
      )}
    </Formik>
  );
};
export default EditRole;
