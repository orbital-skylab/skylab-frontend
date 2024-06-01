import TextInput from "@/components/formikFormControllers/TextInput";
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
import { VoteEvent } from "@/types/voteEvents";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

type EditGeneralSettingsValues = {
  title: string;
  startTime: string;
  endTime: string;
};

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventResponse>;
};

const GeneralSettingsTab: FC<Props> = ({ voteEvent, mutate }) => {
  const { id: voteEventId } = voteEvent;
  const { setSuccess, setError } = useSnackbarAlert();

  const editGeneralSettings = useApiCall({
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
      setSuccess("Vote event edited successfully");
    },
    onError: () => {
      setError("Something went wrong while editing the vote event");
    },
  });

  const handleSubmit = async (values: EditGeneralSettingsValues) => {
    const processedValues = {
      ...values,
      startTime: dateTimeLocalInputToIsoDate(values.startTime),
      endTime: dateTimeLocalInputToIsoDate(values.endTime),
    };

    try {
      await editGeneralSettings.call({
        voteEvent: {
          ...processedValues,
        },
      });
    } catch (error) {
      setError(error);
    }
  };

  const initialValues: EditGeneralSettingsValues = {
    title: voteEvent.title,
    startTime: isoDateToDateTimeLocalInput(voteEvent.startTime),
    endTime: isoDateToDateTimeLocalInput(voteEvent.endTime),
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={editGeneralSettingsValidationSchema}
    >
      {(formik) => (
        <Stack direction="column" spacing="1rem" flexGrow={1}>
          <TextInput
            id="title-input"
            name="title"
            label="Title"
            size="small"
            formik={formik}
          />
          <TextInput
            id="start-time-input"
            name="startTime"
            type="datetime-local"
            label="Start Date Time"
            size="small"
            formik={formik}
          />
          <TextInput
            id="end-time-input"
            name="endTime"
            type="datetime-local"
            label="End Date Time"
            size="small"
            formik={formik}
          />
          <Button
            id="edit-vote-event-general-settings-button"
            variant="contained"
            sx={{ width: "fit-content" }}
            type="submit"
            onClick={formik.submitForm}
          >
            Edit vote event
          </Button>
        </Stack>
      )}
    </Formik>
  );
};
export default GeneralSettingsTab;

export const editGeneralSettingsValidationSchema = Yup.object().shape({
  title: Yup.string().required(ERRORS.REQUIRED),
  startTime: Yup.string().required(ERRORS.REQUIRED),
  endTime: Yup.string()
    .required(ERRORS.REQUIRED)
    .when("startTime", {
      is: (startTime: string) => !!startTime,
      then: Yup.string().test(
        "is-greater-than-start-date-time",
        "End date time must be greater than start date time",
        function (endTime) {
          return (
            !!endTime && new Date(endTime) > new Date(this.parent?.startTime)
          );
        }
      ),
    }),
});
