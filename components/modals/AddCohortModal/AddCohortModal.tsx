import { Dispatch, FC, SetStateAction } from "react";
// Components
import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import {
  isoDateToDateTimeLocalInput,
  getTodayAtTimeIso,
  dateTimeLocalInputToIsoDate,
} from "@/helpers/dates";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ERRORS } from "@/helpers/errors";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import {
  HTTP_METHOD,
  AddCohortResponse,
  GetCohortsResponse,
} from "@/types/api";
import { Mutate } from "@/hooks/useFetch";
import { Cohort } from "@/types/cohorts";

type AddCohortFormValuesType = Cohort;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetCohortsResponse>;
};

const AddCohortModal: FC<Props> = ({ open, setOpen, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const addCohort = useApiCall({
    method: HTTP_METHOD.POST,
    // requiresAuthorization: true,
    endpoint: `/cohorts`,
    onSuccess: ({ cohort }: AddCohortResponse) => {
      mutate((data) => {
        return { cohorts: [...data.cohorts, cohort] };
      });
    },
  });

  const initialValues: AddCohortFormValuesType = {
    academicYear: 2022,
    startDate: isoDateToDateTimeLocalInput(getTodayAtTimeIso(23, 59)),
    endDate: isoDateToDateTimeLocalInput(getTodayAtTimeIso(23, 59)),
  };

  const handleSubmit = async (
    values: AddCohortFormValuesType,
    actions: FormikHelpers<AddCohortFormValuesType>
  ) => {
    const processedValues = {
      cohort: {
        academicYear: Number(values.academicYear),
        startDate: dateTimeLocalInputToIsoDate(values.startDate),
        endDate: dateTimeLocalInputToIsoDate(values.endDate),
      },
    };

    try {
      await addCohort.call(processedValues);
      setSuccess(
        `You have successfully created a new cohort ${values.academicYear}!`
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
      <Modal open={open} handleClose={handleCloseModal} title={`Add Cohort`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addCohortValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <TextInput
                  id="add-cohort-academic-year-input"
                  name="academicYear"
                  label="Academic Year"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  id="add-cohort-start-date-input"
                  name="startDate"
                  type="datetime-local"
                  label="Start Date"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  id="add-cohort-end-date-input"
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
                <Button
                  id="add-cohort-submit-button"
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
export default AddCohortModal;

const addCohortValidationSchema = Yup.object().shape({
  academicYear: Yup.number()
    .min(new Date().getFullYear(), ERRORS.MIN_YEAR)
    .required(ERRORS.REQUIRED),
  startDate: Yup.string().required(ERRORS.REQUIRED),
  endDate: Yup.date()
    .when(
      "startDate",
      (startDate, yup) =>
        startDate &&
        yup.min(startDate, ERRORS.END_DATE_MUST_BE_LATER_THAN_START)
    )
    .required(ERRORS.REQUIRED),
});
