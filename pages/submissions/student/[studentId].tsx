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

const AnonymousSubmissionsStudent: NextPage = () => {
  const { user, isLoading } = useAuth();
  const isAdministrator = Boolean(user?.administrator?.id);

  const { query } = useRouter();
  const { studentId } = query;

  const { data, status } = useFetch<GetSubmissionsAnonymousQuestions>({
    endpoint: `/submissions/student/${studentId}/anonymous-questions`,
  });

  return (
    <Body isLoading={isLoading || isFetching(status)}>
      <UnauthorizedWrapper
        isUnauthorized={
          user?.student?.id !== Number(studentId) && !isAdministrator
        }
      >
        <GoBackButton />
        <NoDataWrapper
          noDataCondition={
            !data ||
            !data.deadlines ||
            !data.deadlines.length ||
            // If all the deadlines do not have any anonymous questions
            !data.deadlines.reduce(
              (acc, { answers }) => acc || Boolean(answers.length),
              false
            )
          }
          fallback={<NoneFound message="No anonymous answers were found" />}
        >
          <Stack gap="2rem">
            {data?.deadlines
              .filter(({ answers }) => Boolean(answers.length))
              .map(({ deadline, sections, answers }) => (
                <Box key={deadline.id}>
                  <Typography fontWeight={600}>{deadline.name}</Typography>
                  {answers.map((answersArray, idx) => (
                    <AnonymousQuestionSectionsList
                      key={idx}
                      questionSections={sections}
                      answersArray={answersArray}
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

export default AnonymousSubmissionsStudent;

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
