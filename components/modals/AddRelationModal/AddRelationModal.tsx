import { Dispatch, FC, SetStateAction } from "react";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
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
  CreateRelationResponse,
} from "@/types/api";
import { Project } from "@/types/projects";

interface AddRelationFormValuesType {
  fromProjectId: number | "";
  toProjectId: number | "";
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetRelationsResponse>;
  projects: Project[];
};

const AddRelationModal: FC<Props> = ({ open, setOpen, mutate, projects }) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const addRelation = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/relations`,
    onSuccess: ({ relation }: CreateRelationResponse) => {
      mutate(({ relations }) => {
        const newRelations = [...relations, relation];
        return { relations: newRelations };
      });
    },
  });

  const initialValues: AddRelationFormValuesType = {
    fromProjectId: "",
    toProjectId: "",
  };

  const handleSubmit = async (
    values: AddRelationFormValuesType,
    actions: FormikHelpers<AddRelationFormValuesType>
  ) => {
    if (values.toProjectId === values.fromProjectId) {
      setError("Cannot create a relation between the same project");
      return;
    }

    const processedValues = {
      relation: values,
    };

    try {
      await addRelation.call(processedValues);
      setSuccess(`You have successfully created a new relation!`);
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
      <Modal open={open} handleClose={handleCloseModal} title={`Add Relation`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addRelationValidationSchema}
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
export default AddRelationModal;

const addRelationValidationSchema = Yup.object().shape({
  fromProjectId: Yup.number().required(ERRORS.REQUIRED),
  toProjectId: Yup.number().required(ERRORS.REQUIRED),
});
