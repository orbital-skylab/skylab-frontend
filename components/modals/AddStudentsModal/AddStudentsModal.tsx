import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
import SnackbarAlert from "@/components/SnackbarAlert";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { toSingular } from "@/helpers/roles";
import useApiCall from "@/hooks/useApiCall";
import useCohort from "@/hooks/useCohort";
import useFetch, { isFetching } from "@/hooks/useFetch";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { GetLeanUsersResponse, HTTP_METHOD } from "@/types/api";
import { Cohort } from "@/types/cohorts";
import { ROLES } from "@/types/roles";
import { Stack, Button, MenuItem, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import Modal from "../Modal";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type AddStudentsFormValuesType = {
  userIds: number[];
};

const refreshSeconds = 3;

const AddStudentsModal: FC<Props> = ({ open, setOpen }) => {
  const router = useRouter();
  const { cohorts, currentCohortYear } = useCohort();
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const [selectedCohortYear, setSelectedCohortYear] = useState(
    currentCohortYear ?? ""
  );

  const memoUsersQueryParams = useMemo(
    () => ({
      cohortYear: selectedCohortYear,
      excludeRole: toSingular(ROLES.STUDENTS),
    }),
    [selectedCohortYear]
  );
  const {
    data: leanUsersWithoutStudentsResponse,
    status: fetchLeanUsersStatus,
  } = useFetch<GetLeanUsersResponse>({
    endpoint: `/users/lean`,
    queryParams: memoUsersQueryParams,
    enabled: !!selectedCohortYear,
  });

  const addStudents = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: "TODO:",
    requiresAuthorization: true,
  });

  const initialValues: AddStudentsFormValuesType = {
    userIds: [],
  };

  const handleSubmit = async (values: AddStudentsFormValuesType) => {
    // TODO: Process values
    const processedValues = { ...values };

    try {
      await addStudents.call(processedValues);
      setTimeout(() => {
        router.reload();
      }, refreshSeconds * 1000);
      setSuccess(
        `Successfully added ${values.userIds.length} students! Refreshing in ${refreshSeconds} seconds...`
      );
    } catch (error) {
      setError(error);
    }
  };

  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
      <Modal open={open} handleClose={handleCloseModal} title="Adding Students">
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
export default AddStudentsModal;
