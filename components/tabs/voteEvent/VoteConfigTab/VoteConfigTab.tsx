import Checkbox from "@/components/formikFormControllers/Checkbox";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import TextInput from "@/components/formikFormControllers/TextInput";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  EditVoteEventResponse,
  GetVoteEventResponse,
  HTTP_METHOD,
} from "@/types/api";
import { DISPLAY_TYPES, VoteConfig, VoteEvent } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { Formik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoteConfigTab: FC<Props> = ({ voteEvent, mutate }) => {
  const { id: voteEventId } = voteEvent;
  const { setSuccess, setError } = useSnackbarAlert();

  const editVoteConfig = useApiCall({
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
      setSuccess("Vote config edited successfully");
    },
    onError: () => {
      setError("Something went wrong while editing the vote config");
    },
  });

  const handleSubmit = async (values: VoteConfig) => {
    try {
      await editVoteConfig.call({
        voteEvent: {
          ...voteEvent,
          voteConfig: {
            ...values,
          },
        },
      });
    } catch (error) {
      setError(error);
    }
  };

  const initialValues: VoteConfig = {
    maxVotes: voteEvent.voteConfig?.maxVotes || 1,
    minVotes: voteEvent.voteConfig?.minVotes || 1,
    isRandomOrder: voteEvent.voteConfig?.isRandomOrder || false,
    instructions: voteEvent.voteConfig?.instructions || "",
    displayType: voteEvent.voteConfig?.displayType || DISPLAY_TYPES.NONE,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={editVoteConfigValidationSchema}
    >
      {(formik) => (
        <Stack spacing={2}>
          <Dropdown
            id="display-type-dropdown"
            label="Select candidate display type"
            name="displayType"
            formik={formik}
            options={Object.values(DISPLAY_TYPES).map((displayType) => ({
              label: displayType,
              value: displayType,
            }))}
          />
          <TextInput
            id="min-votes-input"
            name="minVotes"
            label="Minimum number of votes"
            size="small"
            formik={formik}
          />
          <TextInput
            id="max-votes-input"
            name="maxVotes"
            label="Maximum number of votes"
            size="small"
            formik={formik}
          />
          <Checkbox
            id="random-order-checkbox"
            label="Randomize candidate order"
            name="isRandomOrder"
            formik={formik}
          />
          <RichTextEditor
            id="instructions-input"
            name="instructions"
            formik={formik}
          />
          <LoadingButton
            id="save-vote-config-button"
            size="small"
            variant="contained"
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
            loading={formik.isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
      )}
    </Formik>
  );
};
export default VoteConfigTab;

const editVoteConfigValidationSchema = Yup.object().shape({
  displayType: Yup.string().required("Required"),
  minVotes: Yup.number()
    .integer("Minimum number of votes must be an integer")
    .min(0, "Minimum number of votes vote cannot be less than 0")
    .max(
      Yup.ref("maxVotes"),
      "Minimum number of votes cannot be greater than Maximum number of votes"
    )
    .required("Minimum number of vote is required"),
  maxVotes: Yup.number()
    .integer("Maximum number of votes must be an integer")
    .min(1, "Maximum number of votes cannot be less than 1")
    .required("Maximum number of votes is required"),
  isRandomOrder: Yup.boolean().required("Required"),
});
