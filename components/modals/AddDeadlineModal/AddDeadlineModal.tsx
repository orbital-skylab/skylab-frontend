import { Dispatch, FC, SetStateAction } from "react";
// Components
import Select from "@/components/formControllers/Select";
import TextInput from "@/components/formControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import {
  isoDateToDateTimeLocalInput,
  getTodayAtTimeIso,
  dateTimeLocalInputToIsoDate,
} from "@/helpers/dates";
import { Formik, FormikHelpers } from "formik";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert/useSnackbarAlert";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Deadline, DEADLINE_TYPE } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/pages/deadlines";

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
    onSuccess: ({ deadline }: { deadline: Deadline }) => {
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
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                <Select
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
