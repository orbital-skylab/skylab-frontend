import { isQuestion } from "@/helpers/types";
import { LeanQuestion, Question, Option } from "@/types/deadlines";
import { Stack } from "@mui/material";
import { FC } from "react";
import QuestionCard from "../QuestionCard";

type Props = {
  questions: (Question | LeanQuestion)[];
  answers: Record<string, Option>;
  generateSetAnswer: (questionIdOrIdx: number) => (newAnswer: string) => void;
};

const QuestionsList: FC<Props> = ({
  questions,
  answers,
  generateSetAnswer,
}) => {
  return (
    <Stack spacing="1rem">
      {questions.map((question, idx) => {
        /**
         * In preview mode (question is of type LeanQuestion instead of type Question) while editing Deadline questions,
         * the answer is accessed via its index because it does not have a questionId yet.
         * Else it is accessed via its questionId.
         */
        const questionIdOrIdx = isQuestion(question) ? question.id : idx;
        const answer = answers[questionIdOrIdx];
        const setAnswer = generateSetAnswer(questionIdOrIdx);

        return (
          <QuestionCard
            key={idx}
            idx={idx}
            question={question}
            answer={answer}
            setAnswer={setAnswer}
          />
        );
      })}
    </Stack>
  );
};
export default QuestionsList;
