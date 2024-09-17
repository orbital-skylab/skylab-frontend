import TextInput from "@/components/formikFormControllers/TextInput";
import Modal from "@/components/modals/Modal";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import {
  dateTimeLocalInputToIsoDate,
  isoDateToDateTimeLocalInput,
} from "@/helpers/dates";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  EditVoteEventResponse,
  GetVoteEventResponse,
  HTTP_METHOD,
} from "@/types/api";
import { VoterManagement } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";

type Props = {
  voteEventId: number;
  voterManagement: VoterManagement;
  open: boolean;
  handleCloseMenu: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventResponse>;
};

const InternalVoterRegistrationModal: FC<Props> = ({
  voteEventId,
  voterManagement,
  open,
  handleCloseMenu,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();

  const { registrationStartTime, registrationEndTime } = voterManagement;

  const initialValues = {
    startTime: isoDateToDateTimeLocalInput(registrationStartTime),
    endTime: isoDateToDateTimeLocalInput(registrationEndTime),
  };

  const setRegistration = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEventId}`,
    onSuccess: ({ voteEvent }: EditVoteEventResponse) => {
      mutate(() => {
        return {
          voteEvent: {
            ...voteEvent,
          },
        };
      });
    },
  });

  const handleSaveRegistrationPeriod = async (values: {
    startTime: string;
    endTime: string;
  }) => {
    try {
      await setRegistration.call({
        voteEvent: {
          voterManagement: {
            ...voterManagement,
            registrationStartTime:
              dateTimeLocalInputToIsoDate(values.startTime) === ""
                ? null
                : dateTimeLocalInputToIsoDate(values.startTime),
            registrationEndTime:
              dateTimeLocalInputToIsoDate(values.endTime) === ""
                ? null
                : dateTimeLocalInputToIsoDate(values.endTime),
          },
        },
      });
      setSuccess("You have successfully set the registration period!");
      handleCloseModal();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    handleCloseMenu();
    setOpen(false);
  };

  return (
    <Modal
      id="internal-voter-registration-modal"
      open={open}
      handleClose={handleCloseModal}
      title="Registration"
      subheader={
        "Set the registration period for internal voters to register for this vote event. They will be added to the list of internal voters automatically upon registration."
      }
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSaveRegistrationPeriod}
        validationSchema={registrationPeriodSchema}
      >
        {(formik) => (
          <>
            <Stack direction="column" spacing="1rem">
              <TextInput
                id="registration-start-time-input"
                name="startTime"
                type="datetime-local"
                label="Registration Start Time"
                size="small"
                formik={formik}
              />
              <TextInput
                id="registration-end-time-input"
                name="endTime"
                type="datetime-local"
                label="Registration End Time"
                size="small"
                formik={formik}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="0.5rem"
            >
              <Button
                id="registration-return-button"
                size="small"
                onClick={handleCloseModal}
                disabled={formik.isSubmitting}
              >
                Return
              </Button>
              <LoadingButton
                id={`save-registration-period-button`}
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
  );
};
export default InternalVoterRegistrationModal;

const registrationPeriodSchema = Yup.object().shape({
  startTime: Yup.string().required(ERRORS.REQUIRED),
  endTime: Yup.string()
    .required(ERRORS.REQUIRED)
    .when("startTime", {
      is: (startTime: string) => !!startTime,
      then: Yup.string().test(
        "is-greater-than-start-date-time",
        "End time must be greater than start time",
        function (endTime) {
          return (
            !!endTime && new Date(endTime) > new Date(this.parent?.startTime)
          );
        }
      ),
    }),
});
