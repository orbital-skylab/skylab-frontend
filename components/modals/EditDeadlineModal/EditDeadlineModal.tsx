import { Dispatch, FC, SetStateAction } from "react";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "../Modal";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
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
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
// Types
import {
  HTTP_METHOD,
  GetDeadlinesResponse,
  EditDeadlineResponse,
} from "@/types/api";
import { Deadline, DEADLINE_TYPE } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
interface EditDeadlineFormValuesType {
  name: string;
  dueBy: string;
  type: DEADLINE_TYPE;
  evaluatingMilestoneId?: number | "";
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deadline: Deadline;
  deadlines: Deadline[];
  mutate: Mutate<GetDeadlinesResponse>;
};

const EditDeadlineModal: FC<Props> = ({
  open,
  setOpen,
  deadline,
  deadlines,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const editDeadline = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/deadlines/${deadline.id}`,
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

  const initialValues: EditDeadlineFormValuesType = {
    name: deadline.name,
    dueBy: isoDateToDateTimeLocalInput(deadline.dueBy),
    type: deadline.type,
    evaluatingMilestoneId: deadline.evaluating?.id ?? "",
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
      setSuccess(`You have successfully edited the deadline ${values.name}!`);
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
        open={open}
        handleClose={handleCloseModal}
        title={`Edit Deadline`}
        subheader={`You are editing: ${deadline.name}`}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={editDeadlineValidationSchema}
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
                {formik.values.type === DEADLINE_TYPE.EVALUATION && (
                  <Dropdown
                    label="Evaluating Milestone"
                    name="evaluatingMilestoneId"
                    formik={formik}
                    options={
                      deadlines
                        ? deadlines
                            .filter(
                              ({ type }) => type === DEADLINE_TYPE.MILESTONE
                            )
                            .map((deadline) => {
                              return {
                                label: `${deadline.id}: ${deadline.name}`,
                                value: deadline.id,
                              };
                            })
                        : []
                    }
                  />
                )}
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
export default EditDeadlineModal;

const editDeadlineValidationSchema = Yup.object().shape({
  name: Yup.string().required(ERRORS.REQUIRED),
  dueBy: Yup.string().required(ERRORS.REQUIRED),
  type: Yup.string().required(ERRORS.REQUIRED),
  evaluatingMilestoneId: Yup.string().when("type", {
    is: DEADLINE_TYPE.EVALUATION,
    then: Yup.string().required(ERRORS.REQUIRED),
  }),
});
