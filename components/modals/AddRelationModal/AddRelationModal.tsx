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
import { Team } from "@/types/teams";

interface AddRelationFormValuesType {
  fromTeamId: number | "";
  toTeamId: number | "";
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetRelationsResponse>;
  teams: Team[];
};

const AddRelationModal: FC<Props> = ({ open, setOpen, mutate, teams }) => {
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
    fromTeamId: "",
    toTeamId: "",
  };

  const handleSubmit = async (
    values: AddRelationFormValuesType,
    actions: FormikHelpers<AddRelationFormValuesType>
  ) => {
    if (values.toTeamId === values.fromTeamId) {
      setError("Cannot create a relation between the same team");
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
  fromTeamId: Yup.number().required(ERRORS.REQUIRED),
  toTeamId: Yup.number().required(ERRORS.REQUIRED),
});
