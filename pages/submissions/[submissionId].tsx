// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import GoBackButton from "@/components/buttons/GoBackButton";
import { Box, debounce, Stack, Typography } from "@mui/material";
import QuestionSectionsList from "@/components/questions/QuestionSectionsList";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import useAnswers from "@/hooks/useAnswers";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useAuth from "@/contexts/useAuth";
// Helpers
import { isSubmissionsFromProjectOrUser } from "@/helpers/submissions";
// Types
import type { NextPage } from "next";
import {
  EditSubmissionResponse,
  GetSubmissionResponse,
  HTTP_METHOD,
} from "@/types/api";
import HoverLink from "@/components/typography/HoverLink";
import { PAGES } from "@/helpers/navigation";
import { useCallback, useEffect, useState } from "react";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import UnauthorizedWrapper from "@/components/wrappers/UnauthorizedWrapper";

const Submission: NextPage = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { submissionId } = router.query;
  const { answers, actions, getAnswersAsArray } = useAnswers();
  const { setSuccess, setError } = useSnackbarAlert();
  const [savedAtTime, setSavedAtTime] = useState("");

  const {
    data: submissionResponse,
    status: fetchSubmissionStatus,
    mutate: mutateSubmission,
  } = useFetch<GetSubmissionResponse>({
    endpoint: `/submissions/${submissionId}`,
    requiresAuthorization: true,
    enabled: submissionId !== undefined,
    onFetch: (data) => {
      if (data.submission.answers.length) {
        actions.setAnswersFromArray(data.submission.answers);
      } else {
        actions.setEmptyAnswers(data.submission.sections);
      }
    },
  });

  const isReadonly = !isSubmissionsFromProjectOrUser(
    submissionResponse?.submission,
    user
  );

  const submitAnswers = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/submissions/${submissionId}`,
    requiresAuthorization: true,
    onSuccess: (response: EditSubmissionResponse) => {
      // If the submission was submitted (isDraft === true => isDraft === false)
      if (
        submissionResponse?.submission.isDraft &&
        !response.submission.isDraft
      ) {
        mutateSubmission((oldSubmissionResponse) => {
          const newSubmissionResponse = JSON.parse(
            JSON.stringify(oldSubmissionResponse)
          );
          newSubmissionResponse.submission.isDraft = false;
          return newSubmissionResponse;
        });
      }
    },
  });

  const handleSubmit = async (options?: {
    isDraft?: boolean;
    shouldDisplaySuccess?: boolean;
  }) => {
    const processedValues = {
      answers: getAnswersAsArray(),
      isDraft: Boolean(options?.isDraft),
    };

    try {
      await submitAnswers.call(processedValues);
      if (options?.shouldDisplaySuccess) {
        setSuccess(
          `Successfully ${options?.isDraft ? "saved draft" : "submitted"}!`
        );
      }
    } catch (error) {
      setError(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceAutoSave = useCallback(
    debounce(() => {
      if (submissionResponse && submissionResponse.submission.isDraft) {
        handleSubmit({ isDraft: true, shouldDisplaySuccess: false });
        setSavedAtTime(new Date().toISOString());
      }
    }, 1000),
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", debounceAutoSave);
    return () => {
      document.removeEventListener("keydown", debounceAutoSave);
    };
  }, [debounceAutoSave]);

  return (
    <>
      <Body isLoading={isFetching(fetchSubmissionStatus) || isLoadingAuth}>
        <UnauthorizedWrapper isUnauthorized={Boolean(!isLoadingAuth && !user)}>
          <NoDataWrapper
            noDataCondition={
              !submissionResponse || !submissionResponse.submission
            }
            fallback={
              <NoneFound message="There is no such submission with that ID" />
            }
          >
            <GoBackButton />
            <Stack gap="0.5rem" marginBottom="1.5rem">
              {submissionResponse?.submission.fromProject?.id && (
                <HoverLink
                  href={`${PAGES.PROJECTS}/${submissionResponse?.submission.fromProject?.id}`}
                >
                  {`From: ${submissionResponse?.submission.fromProject?.teamName}`}
                </HoverLink>
              )}
              {submissionResponse?.submission.fromUser?.id && (
                <HoverLink
                  href={`${PAGES.USERS}/${submissionResponse?.submission.fromUser?.id}`}
                >
                  {`From: ${submissionResponse?.submission.fromUser.name}`}
                </HoverLink>
              )}
              {submissionResponse?.submission.toProject?.id && (
                <HoverLink
                  href={`${PAGES.PROJECTS}/${submissionResponse?.submission.toProject?.id}`}
                >
                  {`To: ${submissionResponse?.submission.toProject.teamName}`}
                </HoverLink>
              )}
              {submissionResponse?.submission.toUser?.id && (
                <HoverLink
                  href={`${PAGES.USERS}/${submissionResponse?.submission.fromUser?.id}`}
                >
                  {`To: ${submissionResponse?.submission.toUser.name}`}
                </HoverLink>
              )}
            </Stack>
            <Typography variant="h6" fontWeight={600}>
              {submissionResponse?.submission.deadline?.name}
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {submissionResponse?.submission.deadline?.desc}
            </Typography>
            <Box sx={{ height: "1.5rem" }} />
            <QuestionSectionsList
              questionSections={submissionResponse?.submission.sections ?? []}
              answers={answers}
              answersActions={actions}
              submitAnswers={handleSubmit}
              isSubmitting={isCalling(submitAnswers.status)}
              isReadonly={isReadonly}
              isDraft={submissionResponse?.submission.isDraft}
            />
            {!isReadonly && (
              <Box sx={{ display: "flex", marginTop: "1rem" }}>
                <Typography variant="subtitle2" sx={{ marginLeft: "auto" }}>
                  {savedAtTime === ""
                    ? `Last updated at ${isoDateToLocaleDateWithTime(
                        submissionResponse?.submission.updatedAt ?? ""
                      )}`
                    : `Automatically saved at ${isoDateToLocaleDateWithTime(
                        savedAtTime
                      )}`}
                </Typography>
              </Box>
            )}
          </NoDataWrapper>
        </UnauthorizedWrapper>
      </Body>
    </>
  );
};
export default Submission;
