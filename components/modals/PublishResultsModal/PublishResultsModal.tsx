import Checkbox from "@/components/formikFormControllers/Checkbox";
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
import { VoteEvent } from "@/types/voteEvents";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";
import Modal from "../Modal";

export type PublishResultsFormValuesType = {
  displayLimit: number;
  showRank: boolean;
  showVotes: boolean;
  showPoints: boolean;
  showPercentage: boolean;
};

type Props = {
  voteEvent: VoteEvent;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: Mutate<GetVoteEventResponse>;
};

const PublishResultsModal: FC<Props> = ({
  voteEvent,
  open,
  setOpen,
  mutate,
}) => {
  const { setSuccess, setError } = useSnackbarAlert();
  const { resultsFilter } = voteEvent;

  const editResultsFilter = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/vote-events/${voteEvent.id}`,
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

  const initialValues: PublishResultsFormValuesType = {
    displayLimit: resultsFilter.displayLimit,
    showRank: resultsFilter.showRank,
    showVotes: resultsFilter.showVotes,
    showPoints: resultsFilter.showPoints,
    showPercentage: resultsFilter.showPercentage,
  };

  const handleSubmit = async (values: PublishResultsFormValuesType) => {
    const isCurrentlyPublished = resultsFilter.areResultsPublished;

    const processedValues = {
      voteEvent: {
        ...voteEvent,
        resultsFilter: {
          ...resultsFilter,
          ...values,
          areResultsPublished: !isCurrentlyPublished,
        },
      },
    };

    try {
      await editResultsFilter.call(processedValues);
      setSuccess(
        `Results ${isCurrentlyPublished ? "unpublished" : "published"}`
      );
      setOpen(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      handleClose={handleCloseModal}
      title={`Publish Results`}
      subheader="Publishing results will make them visible to voters of this vote event. 
      By default, project ID and name are displayed. For display limit, use 0 to display all."
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={publishResultsValidationSchema}
      >
        {(formik) => (
          <>
            <Stack direction="column" spacing="1rem">
              <TextInput
                id="display-limit-input"
                name="displayLimit"
                label="Display Limit"
                size="small"
                formik={formik}
              />
              <Checkbox
                id="show-rank-checkbox"
                label="Show Rank"
                name="showRank"
                formik={formik}
              />
              <Checkbox
                id="show-votes-checkbox"
                label="Show Number of Votes"
                name="showVotes"
                formik={formik}
              />
              <Checkbox
                id="show-votes-checkbox"
                label="Show Number of Votes"
                name="showVotes"
                formik={formik}
              />
              <Checkbox
                id="show-points-checkbox"
                label="Show Points"
                name="showPoints"
                formik={formik}
              />
              <Checkbox
                id="show-percentage-checkbox"
                label="Show Points Percentage"
                name="showPercentage"
                formik={formik}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              marginTop="2rem"
            >
              <Button
                id="publish-results-return-button"
                size="small"
                onClick={handleCloseModal}
              >
                Return
              </Button>

              <LoadingButton
                id="publish-results-button"
                size="small"
                variant="contained"
                onClick={formik.submitForm}
                disabled={formik.isSubmitting}
                loading={formik.isSubmitting}
              >
                {resultsFilter.areResultsPublished
                  ? "Unpublish Results"
                  : "Publish Results"}
              </LoadingButton>
            </Stack>
          </>
        )}
      </Formik>
    </Modal>
  );
};
export default PublishResultsModal;

const publishResultsValidationSchema = Yup.object().shape({
  displayLimit: Yup.number()
    .typeError("Display limit must be an integer")
    .integer("Display limit must be an integer")
    .min(0, "Display limit cannot be less than 0")
    .required(ERRORS.REQUIRED),
});
