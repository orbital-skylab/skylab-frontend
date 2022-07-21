import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
// Components
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import TextInput from "@/components/formikFormControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import Modal from "../Modal";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
import useCohort from "@/hooks/useCohort";
import useFetch, { Mutate } from "@/hooks/useFetch";
// Types
import {
  HTTP_METHOD,
  CreateProjectResponse,
  GetUsersResponse,
} from "@/types/api";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { Cohort } from "@/types/cohorts";

interface AddProjectFormValuesType {
  name: string;
  teamName: string;
  achievement: LEVELS_OF_ACHIEVEMENT;
  students: number[];
  adviser: number | "";
  mentor: number | "";
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<Project[]>;
};

const AddProjectModal: FC<Props> = ({ open, setOpen, mutate }) => {
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const { cohorts, currentCohortYear } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState(
    currentCohortYear ?? ""
  );

  const addDeadline = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/projects`,
    onSuccess: ({ project }: CreateProjectResponse) => {
      mutate((projects) => {
        const newProjects = [...projects];
        newProjects.push(project);
        return newProjects;
      });
    },
  });

  const initialValues: AddProjectFormValuesType = {
    name: "",
    teamName: "",
    achievement: LEVELS_OF_ACHIEVEMENT.VOSTOK,
    students: [],
    adviser: "",
    mentor: "",
  };

  /** Fetching student, adviser and mentor IDs and names for the dropdown select */
  const { data: studentsResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users/lean?cohortYear=${selectedCohortYear}&role=Student`,
    enabled: Boolean(selectedCohortYear),
  });
  const { data: advisersResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users/lean?cohortYear=${selectedCohortYear}&role=Adviser`,
    enabled: Boolean(selectedCohortYear),
  });
  const { data: mentorsResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users/lean?cohortYear=${selectedCohortYear}&role=Mentor`,
    enabled: Boolean(selectedCohortYear),
  });

  const handleSubmit = async (
    values: AddProjectFormValuesType,
    actions: FormikHelpers<AddProjectFormValuesType>
  ) => {
    const processedValues = {
      project: { ...values, cohortYear: selectedCohortYear },
    };

    try {
      await addDeadline.call(processedValues);
      setSuccess(`You have successfully created a new project ${values.name}!`);
      handleCloseModal();
      actions.resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
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
      <SnackbarAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
      <Modal open={open} handleClose={handleCloseModal} title={`Add Project`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addProjectValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <TextField
                  name="cohort"
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
                <TextInput
                  name="name"
                  label="Project Name"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  name="teamName"
                  label="Team Name"
                  size="small"
                  formik={formik}
                />
                <Dropdown
                  label="Level of Achievement"
                  name="achievement"
                  size="small"
                  formik={formik}
                  options={Object.values(LEVELS_OF_ACHIEVEMENT).map((loa) => {
                    return { label: loa, value: loa };
                  })}
                />
                <MultiDropdown
                  name="students"
                  label="Student IDs"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    studentsResponse && studentsResponse.users
                      ? studentsResponse.users.map((user) => {
                          return {
                            label: `${user?.student?.id}: ${user.name}`,
                            value: user?.student?.id ?? 0,
                          };
                        })
                      : []
                  }
                />
                <Dropdown
                  name="adviser"
                  label="Adviser ID"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    advisersResponse && advisersResponse.users
                      ? advisersResponse.users.map((user) => {
                          return {
                            label: `${user?.adviser?.id}: ${user.name}`,
                            value: user?.adviser?.id ?? 0,
                          };
                        })
                      : []
                  }
                />
                <Dropdown
                  name="mentor"
                  label="Mentor ID"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    mentorsResponse && mentorsResponse.users
                      ? mentorsResponse.users.map((user) => {
                          return {
                            label: `${user?.mentor?.id}: ${user.name}`,
                            value: user?.mentor?.id ?? 0,
                          };
                        })
                      : []
                  }
                />
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
export default AddProjectModal;

const addProjectValidationSchema = Yup.object().shape({
  name: Yup.string().required(ERRORS.REQUIRED),
  achievement: Yup.string().required(ERRORS.REQUIRED),
  students: Yup.array().min(1, ERRORS.REQUIRED).required(ERRORS.REQUIRED),
  adviser: Yup.number().required(ERRORS.REQUIRED),
  mentor: Yup.number(),
});
