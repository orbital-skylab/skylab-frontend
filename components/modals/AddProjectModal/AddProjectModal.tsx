import { Dispatch, FC, SetStateAction } from "react";
// Components
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import TextInput from "@/components/formikFormControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
// Types
import {
  HTTP_METHOD,
  CreateProjectResponse,
  GetUsersResponse,
} from "@/types/api";
import useFetch, { Mutate } from "@/hooks/useFetch";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";
import { Cohort } from "@/types/cohorts";

interface AddProjectFormValuesType {
  name: string;
  achievement: LEVELS_OF_ACHIEVEMENT;
  students: number[];
  adviser: number | "";
  mentor: number | "";
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<Project[]>;
  cohortYear: Cohort["academicYear"];
};

const AddProjectModal: FC<Props> = ({ open, setOpen, mutate, cohortYear }) => {
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();

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
    achievement: LEVELS_OF_ACHIEVEMENT.VOSTOK,
    students: [],
    adviser: "",
    mentor: "",
  };

  //TODO: Replace with lean routes
  /** Fetching student, adviser and mentor IDs and names for the dropdown select */
  const { data: studentsResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users?cohortYear=${cohortYear}&role=Student`,
  });
  const { data: advisersResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users?cohortYear=${cohortYear}&role=Adviser`,
  });
  const { data: mentorsResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users?cohortYear=${cohortYear}&role=Mentor`,
  });

  const handleSubmit = async (
    values: AddProjectFormValuesType,
    actions: FormikHelpers<AddProjectFormValuesType>
  ) => {
    const processedValues = {
      project: { ...values, cohortYear },
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
                <TextInput
                  name="name"
                  label="Project Name"
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
  students: Yup.array().of(Yup.number()).required(ERRORS.REQUIRED),
  adviser: Yup.number().required(ERRORS.REQUIRED),
  mentor: Yup.number(),
});
