import { Dispatch, FC, SetStateAction } from "react";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// Helpers
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import {
  HTTP_METHOD,
  GetDeadlinesResponse,
  EditDeadlineResponse,
} from "@/types/api";
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import useCohort from "@/contexts/useCohort";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";

interface DuplicateDeadlineFormValuesType {
  cohortYear: number;
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deadline: Deadline;
  mutate: Mutate<GetDeadlinesResponse>;
};

const DuplicateDeadlineModal: FC<Props> = ({
  open,
  setOpen,
  deadline,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const { cohorts, isLoading: isLoadingCohorts } = useCohort();
  const duplicateDeadline = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/deadlines/${deadline.id}/duplicate`,
    onSuccess: ({ deadline: newDeadline }: EditDeadlineResponse) => {
      mutate((data) => {
        const oldDeadlineIdx = data.deadlines.findIndex(
          (deadline) => deadline.id === newDeadline.id
        );
        const newDeadlines = [...data.deadlines];
        newDeadlines.splice(oldDeadlineIdx, 1, newDeadline);
        return { deadlines: newDeadlines };
      });
    },
  });

  const initialValues: DuplicateDeadlineFormValuesType = {
    cohortYear: deadline.cohortYear,
  };

  const handleSubmit = async (
    values: DuplicateDeadlineFormValuesType,
    actions: FormikHelpers<DuplicateDeadlineFormValuesType>
  ) => {
    try {
      await duplicateDeadline.call({
        deadline: values,
      });
      setSuccess(
        `You have successfully duplicated the deadline ${deadline.name}!`
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
      <Modal
        id="duplicate-deadline-modal"
        open={open}
        handleClose={handleCloseModal}
        title={`Duplicate Deadline`}
        subheader={`You are duplicating: ${deadline.name}`}
      >
        <LoadingWrapper isLoading={isLoadingCohorts}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={editDeadlineValidationSchema}
          >
            {(formik) => (
              <>
                <Stack direction="column" spacing="1rem">
                  <Dropdown
                    label="Cohort"
                    name="cohortYear"
                    formik={formik}
                    options={
                      cohorts
                        ? cohorts.map(({ academicYear }) => {
                            return {
                              label: academicYear,
                              value: academicYear,
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
                  <LoadingButton
                    id="confirm-duplicate-deadline-button"
                    size="small"
                    variant="contained"
                    onClick={formik.submitForm}
                    disabled={formik.isSubmitting}
                    loading={formik.isSubmitting}
                  >
                    Duplicate
                  </LoadingButton>
                </Stack>
              </>
            )}
          </Formik>
        </LoadingWrapper>
      </Modal>
    </>
  );
};
export default DuplicateDeadlineModal;

const editDeadlineValidationSchema = Yup.object().shape({
  cohortYear: Yup.number().required(ERRORS.REQUIRED),
});
