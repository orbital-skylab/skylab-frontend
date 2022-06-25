import { FC } from "react";
// Components
import { Button, Stack, Typography } from "@mui/material";
import UserDetails from "@/components/details/UserDetails";
import AdministratorDetailsForm from "@/components/forms/AdministratorDetailsForm";
import AdviserDetailsForm from "@/components/forms/AdviserDetailsForm";
import MentorDetailsForm from "@/components/forms/MentorDetailsForm";
import StudentDetailsForm from "@/components/forms/StudentDetailsForm";
// Helpers
import { generateInitialValues, processValues } from "./EditRole.helpers";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { getRoleId, toSingular } from "@/helpers/roles";
// Hooks
import useApiCall from "@/hooks/useApiCall";
// Types
import { Mutate } from "@/hooks/useFetch";
import { AdministratorMetadata } from "@/types/administrators";
import { AdviserMetadata } from "@/types/advisers";
import { HTTP_METHOD } from "@/types/api";
import { MentorMetadata } from "@/types/mentors";
import { ROLES } from "@/types/roles";
import { StudentMetadata } from "@/types/students";
import { RoleMetadata, User } from "@/types/users";

type Props = {
  user: User;
  viewSelectedRole: ROLES | null;
  handleCloseModal: () => void;
  setViewMode: () => void;
  setSuccess: (message: string) => void;
  setError: (error: unknown) => void;
  mutate: Mutate<User[]>;
};

export type EditRoleFormValuesType = Partial<StudentMetadata> &
  Partial<Omit<AdviserMetadata, "projectIds">> &
  Partial<Omit<MentorMetadata, "projectIds">> &
  Partial<AdministratorMetadata>;

const EditRole: FC<Props> = ({
  user,
  viewSelectedRole,
  handleCloseModal,
  setViewMode,
  setSuccess,
  setError,
  mutate,
}) => {
  const editRole = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/${viewSelectedRole?.toLowerCase()}/${getRoleId(
      user,
      viewSelectedRole
    )}`,
    requiresAuthorization: true,
    onSuccess: (newRoleDetails) => {
      mutate((users) => {
        const userId = user.id;
        const userIdx = users.findIndex((user) => user.id === userId);

        const newUserWithEditedRole: User = { ...user };
        const editedRole = toSingular(
          viewSelectedRole
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

  const initialValues: EditRoleFormValuesType = generateInitialValues(
    user,
    viewSelectedRole
  );

  const handleSubmit = async (
    values: EditRoleFormValuesType,
    actions: FormikHelpers<EditRoleFormValuesType>
  ) => {
    const processedValues = processValues(values, viewSelectedRole);

    try {
      await editRole.call(processedValues);
      setSuccess(
        `You have successfully edited ${user.name}'s ${toSingular(
          viewSelectedRole
        )} details!`
      );
      handleCloseModal();
      actions.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const renderRoleDetailsForm = (
    formik: FormikProps<EditRoleFormValuesType>
  ) => {
    switch (viewSelectedRole) {
      case ROLES.STUDENTS:
        return <StudentDetailsForm formik={formik} />;
      case ROLES.ADVISERS:
        return <AdviserDetailsForm formik={formik} />;
      case ROLES.MENTORS:
        return <MentorDetailsForm formik={formik} />;
      case ROLES.ADMINISTRATORS:
        return <AdministratorDetailsForm formik={formik} />;
      default:
        return null;
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => (
        <>
          <Stack direction="column" spacing="1rem">
            <Typography>User Details</Typography>
            <UserDetails user={user} />

            <Typography>{`Edit ${toSingular(
              viewSelectedRole
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
