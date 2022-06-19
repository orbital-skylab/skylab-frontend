import { Dispatch, FC, SetStateAction } from "react";
// Components
import Select from "@/components/formControllers/Select";
import TextInput from "@/components/formControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
// Helpers
import {
  dateTimeLocalInputToIsoDate,
  isoDateToDateTimeLocalInput,
} from "@/helpers/dates";
import { Formik, FormikHelpers } from "formik";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import { HTTP_METHOD } from "@/types/api";
import { Deadline, DEADLINE_TYPE } from "@/types/deadlines";
import { GetDeadlinesResponse } from "@/pages/deadlines";
import { Mutate } from "@/hooks/useFetch";

interface EditDeadlineFormValuesType {
  name: string;
  dueBy: string;
  type: DEADLINE_TYPE;
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deadline: Deadline;
  mutate: Mutate<GetDeadlinesResponse>;
};

const EditDeadlineModal: FC<Props> = ({ open, setOpen, deadline, mutate }) => {
  const [snackbar, setSnackbar] = useSnackbarAlert();

  const editDeadline = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/deadlines/${deadline.id}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: ({ newDeadline }: any) => {
      // TODO: Fix the any
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

  const initialValues: EditDeadlineFormValuesType = {
    name: deadline.name,
    dueBy: isoDateToDateTimeLocalInput(deadline.dueBy),
    type: deadline.type,
  };

  const handleSubmit = async (
    values: EditDeadlineFormValuesType,
    actions: FormikHelpers<EditDeadlineFormValuesType>
  ) => {
    const processedValues = {
      ...values,
      dueBy: dateTimeLocalInputToIsoDate(values.dueBy),
    };

    try {
      await editDeadline.call({
        deadline: processedValues,
      });
      setSnackbar({
        severity: "success",
        message: `You have successfully edited the deadline ${values.name}!`,
      });
      actions.resetForm();
    } catch (error) {
      setSnackbar({
        severity: "error",
        message: editDeadline.error,
      });
    }

    actions.setSubmitting(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} setSnackbar={setSnackbar} />
      <Modal
        open={open}
        handleClose={handleClose}
        title={`Edit Deadline`}
        subheader={`You are editing: ${deadline.name}`}
      >
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
                <Button size="small" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting}
                >
                  Edit
                </Button>
              </Stack>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default EditDeadlineModal;
