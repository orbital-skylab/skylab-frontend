// Components
import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import QuestionSectionsList from "@/components/questions/QuestionSectionsList";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import UnauthorizedWrapper from "@/components/wrappers/UnauthorizedWrapper";
import { Box, Stack, Typography } from "@mui/material";
import GoBackButton from "@/components/buttons/GoBackButton";
// Hooks
import useAuth from "@/contexts/useAuth";
import useAnswers from "@/hooks/useAnswers";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { useRouter } from "next/router";
// Types
import { GetSubmissionsAnonymousQuestions } from "@/types/api";
import { Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import type { NextPage } from "next";

const AnonymousSubmissions: NextPage = () => {
  const { user, isLoading } = useAuth();
  const isAdministrator = Boolean(user?.administrator?.id);

  const { query } = useRouter();
  const { userId } = query;

  const { data, status } = useFetch<GetSubmissionsAnonymousQuestions>({
    endpoint: `/submissions/users/${userId}/anonymous-questions`,
  });

  return (
    <Body isLoading={isLoading || isFetching(status)}>
      <UnauthorizedWrapper
        isUnauthorized={user?.id !== Number(userId) && !isAdministrator}
      >
        <GoBackButton />
        <NoDataWrapper
          noDataCondition={!data || !data.deadlines || !data.deadlines.length}
          fallback={<NoneFound message="No anonymous answers were found" />}
        >
          <Stack gap="2rem">
            {data?.deadlines.map(({ deadline, submissions }) => (
              <Box key={deadline.id}>
                <Typography fontWeight={600}>{deadline.name}</Typography>
                {submissions.map((submission, idx) => (
                  <AnonymousQuestionSectionsList
                    key={idx}
                    questionSections={submission.sections}
                    answersArray={submission.answers}
                  />
                ))}
              </Box>
            ))}
          </Stack>
        </NoDataWrapper>
      </UnauthorizedWrapper>
    </Body>
  );
};
export default AnonymousSubmissions;

const AnonymousQuestionSectionsList = ({
  questionSections,
  answersArray,
}: {
  questionSections: Section[];
  answersArray: Answer[];
}) => {
  const { answers, actions } = useAnswers();
  actions.setAnswersFromArray(answersArray);

  return (
    <QuestionSectionsList
      questionSections={questionSections}
      answers={answers}
      includeAnonymousQuestions
    />
  );
};
