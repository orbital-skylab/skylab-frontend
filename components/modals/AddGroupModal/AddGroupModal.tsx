import { Dispatch, FC, SetStateAction } from "react";
// Components
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
import SnackbarAlert from "@/components/layout/SnackbarAlert";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
import useAuth from "@/hooks/useAuth";
import useFetch, { Mutate } from "@/hooks/useFetch";
// Types
import {
  HTTP_METHOD,
  GetProjectsResponse,
  CreateGroupResponse,
} from "@/types/api";

interface AddGroupFormValuesType {
  projects: number[];
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetProjectsResponse>;
};

const AddGroupModal: FC<Props> = ({ open, setOpen, mutate }) => {
  const { user } = useAuth();
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();

  const addGroup = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `TODO:`,
    onSuccess: ({ group }: CreateGroupResponse) => {
      mutate(({ projects }) => {
        const newProjects = [...projects];
        newProjects.concat(group.projects);
        return { projects: newProjects };
      });
    },
  });

  const initialValues: AddGroupFormValuesType = {
    projects: [],
  };

  /** Fetching project IDs and names for the dropdown select */
  const { data: projectsResponse } = useFetch<GetProjectsResponse>({
    endpoint: `/projects/adviser/${user?.adviser?.id}`,
    enabled: Boolean(user && user.adviser && user.adviser.id),
  });

  const handleSubmit = async (
    values: AddGroupFormValuesType,
    actions: FormikHelpers<AddGroupFormValuesType>
  ) => {
    const processedValues = {
      adviserId: user?.adviser?.id,
      ...values,
    };

    try {
      await addGroup.call(processedValues);
      setSuccess(`You have successfully created a evaluation group!`);
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
      <Modal open={open} handleClose={handleCloseModal} title={`Add Group`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addGroupValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <MultiDropdown
                  name="projects"
                  label="Projects"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    projectsResponse && projectsResponse.projects
                      ? projectsResponse.projects.map((project) => {
                          return {
                            label: `${project.id}: ${project.name}`,
                            value: project.id,
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
export default AddGroupModal;

const addGroupValidationSchema = Yup.object().shape({
  projects: Yup.array().min(1, ERRORS.REQUIRED).required(ERRORS.REQUIRED),
});
