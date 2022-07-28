import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
// Components
import { MenuItem, TextField } from "@mui/material";
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
  generateAddUserOrRoleEmptyInitialValues,
  processAddUserOrRoleFormValues,
  toSingular,
} from "@/helpers/roles";
import { generateValidationSchema } from "./AddUserModal.helpers";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useCohort from "@/contexts/useCohort";
import { useRouter } from "next/router";
// Types
import { HTTP_METHOD } from "@/types/api";
import { AddUserFormValuesType, ROLES } from "@/types/roles";
import { LeanTeam } from "@/types/teams";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  leanTeams: LeanTeam[] | undefined;
  isFetchingLeanTeams: boolean;
};

const refreshSeconds = 3;

const AddUserModal: FC<Props> = ({
  open,
  setOpen,
  leanTeams,
  isFetchingLeanTeams,
}) => {
  const router = useRouter();
  const { cohorts, currentCohortYear } = useCohort();
  const { setSuccess, setError } = useSnackbarAlert();
  const [selectedRole, setSelectedRole] = useState<ROLES>(ROLES.STUDENTS);

  const addUser = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/${selectedRole.toLowerCase()}`,
    requiresAuthorization: true,
  });

  const initialValues: AddUserFormValuesType =
    generateAddUserOrRoleEmptyInitialValues(currentCohortYear);

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
        }. Refreshing in ${refreshSeconds} seconds...`
      );
      setTimeout(() => {
        router.reload();
      }, refreshSeconds * 1000);
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
      <Modal open={open} handleClose={handleCloseModal} title={`Adding User`}>
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
                    leanTeams={leanTeams}
                    isFetchingLeanTeams={isFetchingLeanTeams}
                  />
                )}
                {selectedRole === ROLES.ADVISERS && (
                  <AdviserDetailsForm
                    formik={formik}
                    cohorts={cohorts}
                    leanTeams={leanTeams}
                    isFetchingLeanTeams={isFetchingLeanTeams}
                  />
                )}
                {selectedRole === ROLES.MENTORS && (
                  <MentorDetailsForm
                    formik={formik}
                    cohorts={cohorts}
                    leanTeams={leanTeams}
                    isFetchingLeanTeams={isFetchingLeanTeams}
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
