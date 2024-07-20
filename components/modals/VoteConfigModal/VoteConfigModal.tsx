import Checkbox from "@/components/formikFormControllers/Checkbox";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import TextInput from "@/components/formikFormControllers/TextInput";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { ERRORS } from "@/helpers/errors";
import useApiCall from "@/hooks/useApiCall";
import { Mutate } from "@/hooks/useFetch";
import {
  EditVoteEventResponse,
  GetVoteEventResponse,
  HTTP_METHOD,
} from "@/types/api";
import { DISPLAY_TYPES, VoteEvent } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";
import Modal from "../Modal";

type EditVoteConfigFormValues = {
  displayType: DISPLAY_TYPES | "";
  minVotes: string;
  maxVotes: string;
  isRandomOrder: boolean;
  instructions: string;
};

type Props = {
  voteEvent: VoteEvent;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventResponse>;
};

const VoteConfigModal: FC<Props> = ({ voteEvent, open, setOpen, mutate }) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const { id: voteEventId } = voteEvent;

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
      handleCloseModal();
    },
    onError: () => {
      setError("Something went wrong while editing the vote config");
    },
  });

  const handleSubmit = async (values: EditVoteConfigFormValues) => {
    try {
      await editVoteConfig.call({
        voteEvent: {
          ...voteEvent,
          voteConfig: {
            ...values,
            minVotes: parseInt(values.minVotes),
            maxVotes: parseInt(values.maxVotes),
          },
        },
      });
    } catch (error) {
      setError(error);
    }
  };

  const initialValues: EditVoteConfigFormValues = {
    maxVotes: voteEvent.voteConfig?.maxVotes.toString() || "1",
    minVotes: voteEvent.voteConfig?.minVotes.toString() || "1",
    isRandomOrder: voteEvent.voteConfig?.isRandomOrder || false,
    instructions: voteEvent.voteConfig?.instructions || "",
    displayType: voteEvent.voteConfig?.displayType || "",
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      id="vote-config-modal"
      open={open}
      handleClose={handleCloseModal}
      title={`Vote Config`}
      subheader="Set your vote configuration for this vote event."
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={voteConfigValidationSchema}
      >
        {(formik) => (
          <>
            <Stack spacing={2} flexGrow={1}>
              <Dropdown
                id="display-type-dropdown"
                label="Select candidate display type"
                name="displayType"
                formik={formik}
                size="small"
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
              <TextInput
                id="instructions-input"
                name="instructions"
                label="Vote event instructions"
                multiline={true}
                formik={formik}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="2rem"
            >
              <Button
                id="vote-config-return-button"
                size="small"
                onClick={handleCloseModal}
              >
                Return
              </Button>
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
          </>
        )}
      </Formik>
    </Modal>
  );
};
export default VoteConfigModal;

const voteConfigValidationSchema = Yup.object().shape({
  displayType: Yup.string()
    .required(ERRORS.REQUIRED)
    .not([""], ERRORS.REQUIRED),
  minVotes: Yup.number()
    .typeError("Minimum number of votes must be an integer")
    .integer("Minimum number of votes must be an integer")
    .min(1, "Minimum number of votes cannot be less than 1")
    .max(
      Yup.ref("maxVotes"),
      "Minimum number of votes cannot be greater than Maximum number of votes"
    )
    .required(ERRORS.REQUIRED),
  maxVotes: Yup.number()
    .typeError("Maximum number of votes must be an integer")
    .integer("Maximum number of votes must be an integer")
    .min(1, "Maximum number of votes cannot be less than 1")
    .required(ERRORS.REQUIRED),
  isRandomOrder: Yup.boolean().required(ERRORS.REQUIRED),
});
