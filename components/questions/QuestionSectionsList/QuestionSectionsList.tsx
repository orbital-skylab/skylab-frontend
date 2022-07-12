import { UseAnswersActions } from "@/hooks/useAnswers/useAnswers";
import { LeanSection, Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import QuestionsList from "./QuestionsList";

type Props = {
  sections: (Section | LeanSection)[];
  answers: Record<Answer["questionId"], Answer["answer"]>;
  accessAnswersWithQuestionIndex?: boolean;
  answersActions: UseAnswersActions;
};

const QuestionSectionsList: FC<Props> = ({
  sections,
  answers,
  accessAnswersWithQuestionIndex,
  answersActions,
}) => {
  const { generateSetAnswer } = answersActions;

  return (
    <Stack spacing="1rem">
      {sections.map(({ name, desc, questions }) => {
        return (
          <>
            <Typography>{name}</Typography>
            <Typography>{desc}</Typography>
            <QuestionsList
              questions={questions}
              answers={answers}
              generateSetAnswer={generateSetAnswer}
              accessAnswersWithQuestionIndex={accessAnswersWithQuestionIndex}
            />
          </>
        );
      })}
    </Stack>
  );
};
export default QuestionSectionsList;
