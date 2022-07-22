import { Dispatch, FC, SetStateAction } from "react";
// Components
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useAuth from "@/contexts/useAuth";
import useFetch, { Mutate } from "@/hooks/useFetch";
// Types
import {
  HTTP_METHOD,
  GetProjectsResponse,
  EditGroupResponse,
} from "@/types/api";
import { Project } from "@/types/projects";

interface EditGroupFormValuesType {
  projects: number[];
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  groupId: number;
  groupSet: Set<Project>;
  mutate: Mutate<GetProjectsResponse>;
};

const EditGroupModal: FC<Props> = ({
  open,
  setOpen,
  groupId,
  groupSet,
  mutate,
}) => {
  const { user } = useAuth();
  const { setSuccess, setError } = useSnackbarAlert();

  const editGroup = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `TODO:`,
    onSuccess: ({ group }: EditGroupResponse) => {
      mutate(({ projects }) => {
        const newProjects = projects.map((project) => {
          const wasProjectInGroup = project.groupId === groupId;
          const isProjectInEditedGroup = group.projects
            .map((proj) => proj.id)
            .includes(project.id);
          if (wasProjectInGroup && !isProjectInEditedGroup) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { groupId, ...projectWithoutGroupId } = project;
            return projectWithoutGroupId;
          } else if (!wasProjectInGroup && isProjectInEditedGroup) {
            return { ...project, groupId };
          } else {
            return project;
          }
        });
        return { projects: newProjects };
      });
    },
  });

  const initialValues: EditGroupFormValuesType = {
    projects: Array.from(groupSet).map((project) => project.id),
  };

  /** Fetching project IDs and names for the dropdown select */
  const { data: projectsResponse } = useFetch<GetProjectsResponse>({
    endpoint: `/projects/adviser/${user?.adviser?.id}`,
    enabled: Boolean(user && user.adviser && user.adviser.id),
  });

  const handleSubmit = async (
    values: EditGroupFormValuesType,
    actions: FormikHelpers<EditGroupFormValuesType>
  ) => {
    const processedValues = {
      project: { ...values },
    };

    try {
      await editGroup.call(processedValues);
      setSuccess(
        `You have successfully edited the evaluation group ${groupId}!`
      );
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
      <Modal open={open} handleClose={handleCloseModal} title={`Edit Group`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={editGroupValidationSchema}
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
                  Save
                </Button>
              </Stack>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default EditGroupModal;

const editGroupValidationSchema = Yup.object().shape({
  projects: Yup.array().min(1, ERRORS.REQUIRED).required(ERRORS.REQUIRED),
});
