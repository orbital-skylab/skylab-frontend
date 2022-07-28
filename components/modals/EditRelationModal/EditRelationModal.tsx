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
import { Team } from "@/types/teams";

interface EditRelationFormValuesType {
  fromTeamId: number;
  toTeamId: number;
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relation: EvaluationRelation;
  mutate: Mutate<GetRelationsResponse>;
  teams: Team[];
};

const EditRelationModal: FC<Props> = ({
  open,
  setOpen,
  relation,
  mutate,
  teams,
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
    fromTeamId: relation.fromTeamId,
    toTeamId: relation.toTeamId,
  };

  const handleSubmit = async (
    values: EditRelationFormValuesType,
    actions: FormikHelpers<EditRelationFormValuesType>
  ) => {
    if (values.toTeamId === values.fromTeamId) {
      setError("Cannot create a relation between the same team");
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
                  name="fromTeamId"
                  label="Evaluator"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    teams && teams.length
                      ? teams.map((team) => {
                          return {
                            label: `${team.id}: ${team.name}`,
                            value: team.id,
                          };
                        })
                      : []
                  }
                />
                <Dropdown
                  name="toTeamId"
                  label="Evaluatee"
                  formik={formik}
                  size="small"
                  isCombobox
                  options={
                    teams && teams.length
                      ? teams.map((team) => {
                          return {
                            label: `${team.id}: ${team.name}`,
                            value: team.id,
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
  fromTeamId: Yup.number().required(ERRORS.REQUIRED),
  toTeamId: Yup.number().required(ERRORS.REQUIRED),
});
