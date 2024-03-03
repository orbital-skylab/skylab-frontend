import { Dispatch, FC, SetStateAction } from "react";
import { Mutate } from "@/hooks/useFetch";
import {
  CreateVoteEventResponse,
  GetVoteEventsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { Formik, FormikHelpers } from "formik";
import {
  dateTimeLocalInputToIsoDate,
  getTodayAtTimeIso,
  isoDateToDateTimeLocalInput,
} from "@/helpers/dates";
import { Button, Stack } from "@mui/material";
import Modal from "../Modal";
import TextInput from "@/components/formikFormControllers/TextInput";
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import * as Yup from "yup";

interface AddVoteEventFormValuesType {
  title: string;
  startTime: string;
  endTime: string;
}

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventsResponse>;
};

const AddVoteEventModal: FC<Props> = ({ open, setOpen, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const addVoteEvent = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events`,
    onSuccess: ({ voteEvent }: CreateVoteEventResponse) => {
      mutate((data) => {
        const newVoteEvents = [...data.voteEvents];
        newVoteEvents.push(voteEvent);
        return { voteEvents: newVoteEvents };
      });
    },
  });

  const initialValues: AddVoteEventFormValuesType = {
    title: "",
    startTime: isoDateToDateTimeLocalInput(getTodayAtTimeIso(23, 59)),
    endTime: isoDateToDateTimeLocalInput(getTodayAtTimeIso(23, 59)),
  };

  const handleSubmit = async (
    values: AddVoteEventFormValuesType,
    actions: FormikHelpers<AddVoteEventFormValuesType>
  ) => {
    const processedValues = {
      ...values,
      startTime: dateTimeLocalInputToIsoDate(values.startTime),
      endTime: dateTimeLocalInputToIsoDate(values.endTime),
    };
    try {
      await addVoteEvent.call({
        voteEvent: processedValues,
      });
      setSuccess(
        `You have successfully created a new vote event ${values.title}!`
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
        id="add-vote-event-modal"
        open={open}
        handleClose={handleCloseModal}
        title={`Add New Vote Event`}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addVoteEventValidationSchema}
        >
          {(formik) => (
            <>
              <Stack direction="column" spacing="1rem">
                <TextInput
                  name="title"
                  label="Title"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  name="startTime"
                  type="datetime-local"
                  label="Start Date Time"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  name="endTime"
                  type="datetime-local"
                  label="End Date Time"
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
                  Cancel{" "}
                </Button>
                <Button
                  id="submit-vote-event-button"
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
export default AddVoteEventModal;

const addVoteEventValidationSchema = Yup.object().shape({
  title: Yup.string().required(ERRORS.REQUIRED),
  startTime: Yup.string().required(ERRORS.REQUIRED),
  endTime: Yup.string().required(ERRORS.REQUIRED),
});
