import TextInput from "@/components/formikFormControllers/TextInput";
import Body from "@/components/layout/Body";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetVoteEventResponse, HTTP_METHOD } from "@/types/api";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import * as Yup from "yup";
import {
  dateTimeLocalInputToIsoDate,
  isoDateToDateTimeLocalInput,
} from "@/helpers/dates";

type EditVoteEventFormValues = {
  title: string;
  startTime: string;
  endTime: string;
};

const EditVoteEvent: NextPage = () => {
  const router = useRouter();
  const { voteEventId } = router.query;
  const { setSuccess, setError } = useSnackbarAlert();

  const { data, status } = useFetch<GetVoteEventResponse>({
    endpoint: `/vote-events/${voteEventId}`,
  });

  const editVoteEvent = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEventId}`,
    onSuccess: () => {
      setSuccess("Vote event edited successfully");
    },
    onError: () => {
      setError("Something went wrong while editing the vote event");
    },
  });

  const handleSubmit = async (values: EditVoteEventFormValues) => {
    const processedValues = {
      ...values,
      startTime: dateTimeLocalInputToIsoDate(values.startTime),
      endTime: dateTimeLocalInputToIsoDate(values.endTime),
    };
    await editVoteEvent.call({
      voteEvent: {
        ...processedValues,
      },
    });
  };

  const initialValues: EditVoteEventFormValues = {
    title: data?.voteEvent.title ?? "",
    startTime: isoDateToDateTimeLocalInput(data?.voteEvent.startTime ?? ""),
    endTime: isoDateToDateTimeLocalInput(data?.voteEvent.endTime ?? ""),
  };

  return (
    <Body
      isLoading={isFetching(status)}
      loadingText="Loading edit vote event..."
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={editVoteEventValidationSchema}
      >
        {(formik) => (
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
            <Button
              id="edit-announcement-post-button"
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
    </Body>
  );
};

export default EditVoteEvent;

const editVoteEventValidationSchema = Yup.object().shape({
  title: Yup.string().required(ERRORS.REQUIRED),
  startTime: Yup.string().required(ERRORS.REQUIRED),
  endTime: Yup.string().required(ERRORS.REQUIRED),
});
