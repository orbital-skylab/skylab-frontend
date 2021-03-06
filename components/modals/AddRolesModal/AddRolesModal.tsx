import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
// Components
import Modal from "../Modal";
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { Stack, Button, MenuItem, TextField, Typography } from "@mui/material";
// Hooks@/contexts/useCohort
import useApiCall from "@/hooks/useApiCall";
import useCohort from "@/contexts/useCohort";
import useFetch, { isFetching } from "@/hooks/useFetch";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { useRouter } from "next/router";
// Helpers
import { Formik } from "formik";
import { toSingular } from "@/helpers/roles";
// Types
import { GetLeanUsersResponse, HTTP_METHOD } from "@/types/api";
import { Cohort } from "@/types/cohorts";
import { ROLES } from "@/types/roles";

type Props = {
  selectedRole: ROLES | null;
  handleCloseModal: () => void;
};

type AddRolesFormValuesType = {
  userIds: number[];
};

const refreshSeconds = 3;

const AddRolesModal: FC<Props> = ({ selectedRole, handleCloseModal }) => {
  const open = Boolean(selectedRole);
  const router = useRouter();
  const { cohorts, currentCohortYear } = useCohort();
  const { setSuccess, setError } = useSnackbarAlert();
  const [selectedCohortYear, setSelectedCohortYear] = useState(
    currentCohortYear ?? ""
  );

  const memoUsersQueryParams = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      excludeRole: toSingular(selectedRole),
    }),
    [selectedCohortYear, selectedRole]
  );
  const {
    data: leanUsersWithoutStudentsResponse,
    status: fetchLeanUsersStatus,
  } = useFetch<GetLeanUsersResponse>({
    endpoint: `/users/lean`,
    queryParams: memoUsersQueryParams,
    enabled: Boolean(selectedCohortYear) && Boolean(selectedCohortYear),
  });

  const addStudents = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: "TODO:",
    requiresAuthorization: true,
  });

  const initialValues: AddRolesFormValuesType = {
    userIds: [],
  };

  const handleSubmit = async (values: AddRolesFormValuesType) => {
    // TODO: Process values
    const processedValues = { ...values };

    try {
      await addStudents.call(processedValues);
      setTimeout(() => {
        router.reload();
      }, refreshSeconds * 1000);
      setSuccess(
        `Successfully added ${
          values.userIds.length
        } ${selectedRole?.toLowerCase()}! Refreshing in ${refreshSeconds} seconds...`
      );
    } catch (error) {
      setError(error);
    }
  };

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Adding ${selectedRole}`}
      >
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(formik) => (
            <Stack direction="column" spacing="1rem">
              <TextField
                label="Cohort"
                value={selectedCohortYear}
                onChange={handleCohortYearChange}
                select
                size="small"
              >
                {cohorts &&
                  cohorts.map(({ academicYear }) => (
                    <MenuItem key={academicYear} value={academicYear}>
                      {academicYear}
                    </MenuItem>
                  ))}
              </TextField>
              <LoadingWrapper isLoading={isFetching(fetchLeanUsersStatus)}>
                <NoDataWrapper
                  noDataCondition={Boolean(
                    !leanUsersWithoutStudentsResponse?.users.length
                  )}
                  fallback={<Typography>No users found</Typography>}
                >
                  <MultiDropdown
                    name="userIds"
                    label="Users"
                    formik={formik}
                    isCombobox
                    options={
                      leanUsersWithoutStudentsResponse &&
                      leanUsersWithoutStudentsResponse.users
                        ? leanUsersWithoutStudentsResponse.users.map(
                            (leanUser) => ({
                              label: `${leanUser.id}: ${leanUser.name}`,
                              value: leanUser.id,
                            })
                          )
                        : []
                    }
                  />
                </NoDataWrapper>
              </LoadingWrapper>
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
            </Stack>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default AddRolesModal;
