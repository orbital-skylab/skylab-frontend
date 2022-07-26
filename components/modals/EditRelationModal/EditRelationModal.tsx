import { Dispatch, FC, SetStateAction } from "react";
// Components
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import { Mutate } from "@/hooks/useFetch";
import {
  HTTP_METHOD,
  GetRelationsResponse,
  EditRelationResponse,
} from "@/types/api";
import { EvaluationRelation } from "@/types/relations";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import { Project } from "@/types/projects";

interface EditRelationFormValuesType {
  fromProjectId: number;
  toProjectId: number;
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relation: EvaluationRelation;
  mutate: Mutate<GetRelationsResponse>;
  projects: Project[];
};

const EditRelationModal: FC<Props> = ({
  open,
  setOpen,
  relation,
  mutate,
  projects,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const editRelation = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/relations/${relation.id}`,
    onSuccess: ({ relation: newRelation }: EditRelationResponse) => {
      mutate(({ relations }) => {
        const newRelations = [...relations];
        const oldRelationIdx = newRelations.findIndex(
          (relation) => relation.id === newRelation.id
        );
        newRelations.splice(oldRelationIdx, 1, newRelation);

        return { relations: newRelations };
      });
    },
  });

  const initialValues: EditRelationFormValuesType = {
    fromProjectId: relation.fromProjectId,
    toProjectId: relation.toProjectId,
  };

  const handleSubmit = async (
    values: EditRelationFormValuesType,
    actions: FormikHelpers<EditRelationFormValuesType>
  ) => {
    if (values.toProjectId === values.fromProjectId) {
      setError("Cannot create a relation between the same project");
      return;
    }

    const processedValues = {
      relation: values,
    };

    try {
      await editRelation.call(processedValues);
      setSuccess(`You have successfully edited the relation ${relation.id}!`);
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
          validationSchema={editRelationValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <Dropdown
                  name="fromProjectId"
                  label="Evaluator"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    projects && projects.length
                      ? projects.map((project) => {
                          return {
                            label: `${project.id}: ${project.name}`,
                            value: project.id,
                          };
                        })
                      : []
                  }
                />
                <Dropdown
                  name="toProjectId"
                  label="Evaluatee"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    projects && projects.length
                      ? projects.map((project) => {
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
export default EditRelationModal;

const editRelationValidationSchema = Yup.object().shape({
  fromProjectId: Yup.number().required(ERRORS.REQUIRED),
  toProjectId: Yup.number().required(ERRORS.REQUIRED),
});
