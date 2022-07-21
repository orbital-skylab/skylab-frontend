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
import useAuth from "@/hooks/useAuth";
// Helpers
import { isSubmissionsFromProjectOrUser } from "@/helpers/submissions";
// Types
import type { NextPage } from "next";
import { GetSubmissionResponse, HTTP_METHOD } from "@/types/api";

const Submission: NextPage = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { submissionId } = router.query;
  const { answers, actions, getAnswersAsArray } = useAnswers();
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  const { data: submissionResponse, status: fetchSubmissionStatus } =
    useFetch<GetSubmissionResponse>({
      endpoint: `/api/submissions/${submissionId}`,
      requiresAuthorization: true,
      enabled: submissionId !== undefined,
      onFetch: (data) => actions.setAnswersFromArray(data.submission.answers),
    });

  const isEditMode = isSubmissionsFromProjectOrUser(
    submissionResponse?.submission,
    user
  );

  const submitAnswers = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/submissions/${submissionId}`,
    requiresAuthorization: true,
  });

  const handleSubmit = async (options?: { isDraft: boolean }) => {
    const processedValues = {
      answers: getAnswersAsArray(),
      isDraft: Boolean(options?.isDraft),
    };

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
      <Body isLoading={isFetching(fetchSubmissionStatus) || isLoadingAuth}>
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
            isReadonly={!isEditMode}
          />
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default Submission;