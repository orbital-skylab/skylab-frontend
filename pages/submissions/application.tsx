// Components
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import GoBackButton from "@/components/buttons/GoBackButton";
import { Box, Typography } from "@mui/material";
import QuestionSectionsList from "@/components/questions/QuestionSectionsList";
// Hooks
import useFetch, { isFetching } from "@/hooks/useFetch";
import useAnswers from "@/hooks/useAnswers";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useAuth from "@/contexts/useAuth";
// Types
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";
import UnauthorizedWrapper from "@/components/wrappers/UnauthorizedWrapper";
import { Submission } from "@/types/submissions";
import { useRouter } from "next/router";

type GetLatestApplicationResponse = {
  application: Pick<Submission, "deadline" | "sections">;
};

const Application: NextPage = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { answers, actions, getAnswersAsArray } = useAnswers();
  const { setSuccess, setError } = useSnackbarAlert();

  const {
    data: latestApplicationResponse,
    status: fetchLatestApplicationStatus,
  } = useFetch<GetLatestApplicationResponse>({
    endpoint: "/application",
    onFetch: (data) => {
      actions.setEmptyAnswers(data.application.sections);
    },
  });

  const submitAnswers = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: "/application",
  });

  const handleSubmit = async () => {
    const processedValues = {
      submission: {
        deadlineId: latestApplicationResponse?.application.deadline.id,
        answers: getAnswersAsArray(),
      },
    };

    try {
      await submitAnswers.call(processedValues);
      setSuccess("Successfully submitted!");
      router.push("/");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <Body
        isLoading={isFetching(fetchLatestApplicationStatus) || isLoadingAuth}
      >
        <UnauthorizedWrapper isUnauthorized={Boolean(user)}>
          <NoDataWrapper
            noDataCondition={
              !latestApplicationResponse ||
              !latestApplicationResponse.application
            }
            fallback={
              <NoneFound message="There is no ongoing application for Orbital" />
            }
          >
            <GoBackButton />
            <Typography variant="h6" fontWeight={600}>
              {latestApplicationResponse?.application.deadline?.name}
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {latestApplicationResponse?.application.deadline?.desc}
            </Typography>
            <Box sx={{ height: "1.5rem" }} />
            <QuestionSectionsList
              questionSections={
                latestApplicationResponse?.application.sections ?? []
              }
              answers={answers}
              answersActions={actions}
              submitAnswers={handleSubmit}
              isSubmitting={isCalling(submitAnswers.status)}
              isDraft={false}
              isApplication
            />
          </NoDataWrapper>
        </UnauthorizedWrapper>
      </Body>
    </>
  );
};
export default Application;
