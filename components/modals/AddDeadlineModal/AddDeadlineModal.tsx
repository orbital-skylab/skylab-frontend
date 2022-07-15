import { Dispatch, FC, SetStateAction } from "react";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
import TextInput from "@/components/formikFormControllers/TextInput";
import SnackbarAlert from "@/components/layout/SnackbarAlert";
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
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
// Types
import {
  HTTP_METHOD,
  GetDeadlinesResponse,
  CreateDeadlineResponse,
} from "@/types/api";
import { DEADLINE_TYPE } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";

interface AddDeadlineFormValuesType {
  name: string;
  dueBy: string;
  type: DEADLINE_TYPE;
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cohortYear: number;
  mutate: Mutate<GetDeadlinesResponse>;
};

const AddDeadlineModal: FC<Props> = ({ open, setOpen, cohortYear, mutate }) => {
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();

  const addDeadline = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/deadlines`,
    onSuccess: ({ deadline }: CreateDeadlineResponse) => {
      mutate((data) => {
        const newDeadlines = [...data.deadlines];
        newDeadlines.push(deadline);
        return { deadlines: newDeadlines };
      });
    },
  });

  const initialValues: AddDeadlineFormValuesType = {
    name: "",
    dueBy: isoDateToDateTimeLocalInput(getTodayAtTimeIso(23, 59)),
    type: DEADLINE_TYPE.MILESTONE,
  };

  const handleSubmit = async (
    values: AddDeadlineFormValuesType,
    actions: FormikHelpers<AddDeadlineFormValuesType>
  ) => {
    const processedValues = {
      ...values,
      dueBy: dateTimeLocalInputToIsoDate(values.dueBy),
      cohortYear,
    };

    try {
      await addDeadline.call({
        deadline: processedValues,
      });
      setSuccess(
        `You have successfully created a new deadline ${values.name}!`
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
      <SnackbarAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
      <Modal open={open} handleClose={handleCloseModal} title={`Add Deadline`}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addDeadlineValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <TextInput
                  name="name"
                  label="Name"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  name="dueBy"
                  type="datetime-local"
                  label="Due By"
                  size="small"
                  formik={formik}
                />
                <Dropdown
                  label="Type"
                  name="type"
                  formik={formik}
                  options={Object.values(DEADLINE_TYPE).map((val) => {
                    return { label: val, value: val };
                  })}
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
export default AddDeadlineModal;

const addDeadlineValidationSchema = Yup.object().shape({
  name: Yup.string().required(ERRORS.REQUIRED),
  dueBy: Yup.string().required(ERRORS.REQUIRED),
  type: Yup.string().required(ERRORS.REQUIRED),
});
