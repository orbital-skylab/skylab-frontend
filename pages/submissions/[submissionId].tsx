// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import GoBackButton from "@/components/buttons/GoBackButton";
import { Typography } from "@mui/material";
import QuestionSectionsList from "@/components/questions/QuestionSectionsList";
import SnackbarAlert from "@/components/SnackbarAlert";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import useAnswers from "@/hooks/useAnswers";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import type { NextPage } from "next";
import { GetSubmissionResponse } from "@/types/api";

const Submission: NextPage = () => {
  const router = useRouter();
  const { submissionId } = router.query;
  const { answers, actions } = useAnswers();
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  const { data: submissionResponse, status: fetchSubmissionStatus } =
    useFetch<GetSubmissionResponse>({
      endpoint: `/api/submissions/${submissionId}`,
      requiresAuthorization: true,
      enabled: submissionId !== undefined,
      onFetch: (data) => actions.setAnswers(data.submission.answers),
    });

  const submitAnswers = useApiCall({
    endpoint: "TODO:",
    requiresAuthorization: true,
  });

  const handleSubmit = async (options?: { isDraft: boolean }) => {
    const processedValues = { ...answers };

    try {
      await submitAnswers.call(processedValues);
      setSuccess(
        `Successfully ${options?.isDraft ? "saved draft" : "submitted"}!`
      );
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body isLoading={isFetching(fetchSubmissionStatus)}>
        <NoDataWrapper
          noDataCondition={
            !submissionResponse || !submissionResponse.submission
          }
          fallback={
            <NoneFound message="There is no such submission with that ID" />
          }
        >
          <GoBackButton />
          {submissionResponse?.submission.fromProject?.id && (
            <Typography variant="caption">
              {`${submissionResponse?.submission.fromProject}`}
            </Typography>
          )}
          {submissionResponse?.submission.fromUser?.id && (
            <Typography variant="caption">
              {`${submissionResponse?.submission.fromUser}`}
            </Typography>
          )}
          {submissionResponse?.submission.toProject?.id && (
            <Typography variant="caption">
              {`${submissionResponse?.submission.toProject}`}
            </Typography>
          )}
          {submissionResponse?.submission.toUser?.id && (
            <Typography variant="caption">
              {`${submissionResponse?.submission.toUser}`}
            </Typography>
          )}
          <Typography variant="h6" fontWeight={600}>
            {submissionResponse?.submission.deadline.name}
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {submissionResponse?.submission.deadline.desc}
          </Typography>
          <QuestionSectionsList
            questionSections={submissionResponse?.submission.sections ?? []}
            answers={answers}
            answersActions={actions}
            submitAnswers={handleSubmit}
            isSubmitting={isCalling(submitAnswers.status)}
          />
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default Submission;
