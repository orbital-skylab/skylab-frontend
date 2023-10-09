import { Dispatch, FC, SetStateAction } from "react";
// Components
import { Stack, Button } from "@mui/material";
import Modal from "../Modal";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import PreviewRelationsTable from "@/components/tables/PreviewRelationsTable/PreviewRelationsTable";
// Hook
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { useRouter } from "next/router";
import useApiCall from "@/hooks/useApiCall";
// Helpers
import * as Yup from "yup";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Formik } from "formik";
import { Project } from "@/types/projects";
import { ERRORS } from "@/helpers/errors";
import { EvaluationRelation } from "@/types/relations";

const refreshSeconds = 3;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projects: Project[];
  relations: EvaluationRelation[];
};

interface DeleteRelationsViaTeamFormValuesType {
  projectId: number | "";
}

const DeleteRelationsViaTeamModal: FC<Props> = ({
  open,
  setOpen,
  projects,
  relations,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const router = useRouter();

  const deleteRelationsViaTeam = useApiCall({
    method: HTTP_METHOD.DELETE,
  });

  const initialValues: DeleteRelationsViaTeamFormValuesType = {
    projectId: "",
  };

  const handleSubmit = async (values: DeleteRelationsViaTeamFormValuesType) => {
    try {
      deleteRelationsViaTeam.setEndpoint(
        `/relations/project/${values.projectId}`
      );
      await deleteRelationsViaTeam.call();
      setSuccess(
        `You have successfully deleted the relations! Refreshing in ${refreshSeconds} seconds...`
      );
      setTimeout(() => {
        router.reload();
      }, refreshSeconds * 1000);
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Delete Relations via Team`}
        subheader={`You are deleting all relations linked to a specified team. Note that only the relations will be deleted but the teams will not be deleted.\n\nThis action is irreversible, are you sure?`}
        sx={{ width: "400px" }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={deleteRelationsViaTeamValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <Dropdown
                  name="projectId"
                  label="Team"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    projects && projects.length
                      ? projects.map((project) => {
                          return {
                            label: `${project.id}: ${project.teamName}`,
                            value: project.id,
                          };
                        })
                      : []
                  }
                />
                {relations.length && formik.values.projectId !== "" ? (
                  <PreviewRelationsTable
                    relations={relations.filter(
                      (relation) =>
                        relation.fromProjectId === formik.values.projectId ||
                        relation.toProjectId === formik.values.projectId
                    )}
                  />
                ) : null}
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
                  color="error"
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting || !formik.values.projectId}
                >
                  Delete
                </Button>
              </Stack>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default DeleteRelationsViaTeamModal;

const deleteRelationsViaTeamValidationSchema = Yup.object().shape({
  projectId: Yup.number().required(ERRORS.REQUIRED),
});
