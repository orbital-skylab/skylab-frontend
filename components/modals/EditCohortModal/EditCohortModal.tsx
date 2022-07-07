import { Dispatch, FC, SetStateAction } from "react";
// Components
import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import {
  dateTimeLocalInputToIsoDate,
  isoDateToDateTimeLocalInput,
} from "@/helpers/dates";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import {
  Cohort,
  EditCohortResponse,
  GetCohortsResponse,
} from "@/types/cohorts";
import { LoadingButton } from "@mui/lab";

type EditCohortFormValuesType = Omit<Cohort, "academicYear">;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cohort: Cohort;
  mutate: Mutate<GetCohortsResponse>;
  setSuccess: (message: string) => void;
  setError: (error: unknown) => void;
};

const EditCohortModal: FC<Props> = ({
  open,
  setOpen,
  cohort,
  mutate,
  setSuccess,
  setError,
}) => {
  const editCohort = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/cohorts/${cohort.academicYear}`,
    onSuccess: ({ cohort }: EditCohortResponse) => {
      mutate((data) => {
        const oldCohortAcademicYear = cohort.academicYear;
        const oldCohortIdx = data.cohorts.findIndex(
          (cohort) => cohort.academicYear === oldCohortAcademicYear
        );
        const newCohorts = [...data.cohorts];
        newCohorts.splice(oldCohortIdx, 1, cohort);
        return { cohorts: newCohorts };
      });
    },
  });

  const initialValues: EditCohortFormValuesType = {
    startDate: isoDateToDateTimeLocalInput(cohort.startDate),
    endDate: isoDateToDateTimeLocalInput(cohort.endDate),
  };

  const handleSubmit = async (
    values: EditCohortFormValuesType,
    actions: FormikHelpers<EditCohortFormValuesType>
  ) => {
    const processedValues = {
      cohort: {
        startDate: dateTimeLocalInputToIsoDate(values.startDate),
        endDate: dateTimeLocalInputToIsoDate(values.endDate),
      },
    };

    try {
      await editCohort.call(processedValues);
      setSuccess(
        `You have successfully edited the cohort ${cohort.academicYear}!`
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
      <Modal open={open} handleClose={handleCloseModal} title={`Edit Cohort`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={editCohortValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <TextInput
                  name="startDate"
                  type="datetime-local"
                  label="Start Date"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  name="endDate"
                  type="datetime-local"
                  label="End Date"
                  size="small"
                  formik={formik}
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
                  size="small"
                  variant="contained"
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting}
                  loading={formik.isSubmitting}
                >
                  Save
                </LoadingButton>
              </Stack>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default EditCohortModal;

const editCohortValidationSchema = Yup.object().shape({
  startDate: Yup.date().required(ERRORS.REQUIRED),
  endDate: Yup.date()
    .when(
      "startDate",
      (startDate, yup) =>
        startDate &&
        yup.min(startDate, ERRORS.END_DATE_MUST_BE_LATER_THAN_START)
    )
    .required(ERRORS.REQUIRED),
});
