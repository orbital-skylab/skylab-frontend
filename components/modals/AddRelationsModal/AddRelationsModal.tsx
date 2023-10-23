import { Dispatch, FC, SetStateAction } from "react";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
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

interface AddRelationsFormValuesType {
  fromProjectId: number | "";
  toProjectIds: number[];
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetRelationsResponse>;
  projects: Project[];
};

const AddRelationsModal: FC<Props> = ({ open, setOpen, mutate, projects }) => {
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

  const initialValues: AddRelationsFormValuesType = {
    fromProjectId: "",
    toProjectIds: [],
  };

  const handleSubmit = async (
    values: AddRelationsFormValuesType,
    actions: FormikHelpers<AddRelationsFormValuesType>
  ) => {
    const { toProjectIds, fromProjectId } = values;
    // Yup validation should have ensured `fromProjectId` is not an empty string
    if (toProjectIds.includes(fromProjectId as number)) {
      setError("Cannot create a relation between the same project");
      return;
    }

    try {
      await Promise.all(
        toProjectIds.map(async (toProjectId) => {
          const processedValues = {
            relation: {
              fromProjectId,
              toProjectId,
            },
          };
          return await addRelation.call(processedValues);
        })
      );
      setSuccess(
        `You have successfully created ${toProjectIds.length} new relation${
          toProjectIds.length > 1 ? "s" : ""
        }!`
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
      <Modal open={open} handleClose={handleCloseModal} title={`Add Relations`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addRelationsValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <Dropdown
                  id="from-project-id-input"
                  name="fromProjectId"
                  label="Evaluator"
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
                <MultiDropdown
                  id="to-project-ids-input"
                  name="toProjectIds"
                  label="Evaluatee(s)"
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
export default AddRelationsModal;

const addRelationsValidationSchema = Yup.object().shape({
  fromProjectId: Yup.number().required(ERRORS.REQUIRED),
  toProjectIds: Yup.array().of(Yup.number()).required(ERRORS.REQUIRED),
});
