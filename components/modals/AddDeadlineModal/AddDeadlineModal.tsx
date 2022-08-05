import { Dispatch, FC, SetStateAction } from "react";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
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
  GetDeadlinesResponse,
  CreateDeadlineResponse,
} from "@/types/api";
import { Deadline, DEADLINE_TYPE } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";

interface AddDeadlineFormValuesType {
  name: string;
  dueBy: string;
  type: DEADLINE_TYPE;
  evaluatingMilestoneId?: number | "";
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cohortYear: number;
  mutate: Mutate<GetDeadlinesResponse>;
  deadlines: Deadline[];
};

const AddDeadlineModal: FC<Props> = ({
  open,
  setOpen,
  cohortYear,
  mutate,
  deadlines,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

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
    evaluatingMilestoneId: "",
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
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={`Add Deadline for Cohort ${cohortYear}`}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addDeadlineValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <TextInput
                  id="deadline-name-input"
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
                <Button
                  id="submit-deadline-button"
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
  evaluatingMilestoneId: Yup.string().when("type", {
    is: DEADLINE_TYPE.EVALUATION,
    then: Yup.string().required(ERRORS.REQUIRED),
  }),
});
