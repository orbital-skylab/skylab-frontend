import TextInput from "@/components/formikFormControllers/TextInput";
import { editGeneralSettingsValidationSchema as addVoteEventValidationSchema } from "@/components/tabs/voteEvent/GeneralSettingsTab/GeneralSettingsTab";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import {
  addOneDayToISOString,
  dateTimeLocalInputToIsoDate,
  isoDateToDateTimeLocalInput,
} from "@/helpers/dates";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  CreateVoteEventResponse,
  GetVoteEventsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction } from "react";
import Modal from "../Modal";

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
  const router = useRouter();

  const addVoteEvent = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: `/vote-events`,
    onSuccess: ({ voteEvent }: CreateVoteEventResponse) => {
      mutate((data) => {
        const newVoteEvents = [voteEvent, ...data.voteEvents];
        return { voteEvents: newVoteEvents };
      });

      router.push(`/vote-events/${voteEvent.id}/edit`);
    },
  });

  const initialValues: AddVoteEventFormValuesType = {
    title: "",
    startTime: isoDateToDateTimeLocalInput(new Date().toISOString()),
    // set end time one day after start time
    endTime: isoDateToDateTimeLocalInput(
      addOneDayToISOString(new Date().toISOString())
    ),
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
                  id="add-vote-event-title-input"
                  name="title"
                  label="Title"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  id="add-vote-event-start-time-input"
                  name="startTime"
                  type="datetime-local"
                  label="Start Date Time"
                  size="small"
                  formik={formik}
                />
                <TextInput
                  id="add-vote-event-end-time-input"
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
                <Button
                  id="cancel-add-vote-event-button"
                  size="small"
                  onClick={handleCloseModal}
                  disabled={formik.isSubmitting}
                >
                  Cancel{" "}
                </Button>
                <LoadingButton
                  id="add-vote-event-button"
                  size="small"
                  variant="contained"
                  onClick={formik.submitForm}
                  disabled={formik.isSubmitting}
                  loading={formik.isSubmitting}
                >
                  Add
                </LoadingButton>
              </Stack>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default AddVoteEventModal;
