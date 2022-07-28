import { isQuestion } from "@/helpers/types";
import { LeanQuestion, Question } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import { Stack } from "@mui/material";
import { FC } from "react";
import QuestionCard from "../../QuestionCard";

type Props = {
  questions: (Question | LeanQuestion)[];
  answers: Map<Answer["questionId"], Answer["answer"]>;
  generateSetAnswer?: (questionIdOrIdx: number) => (newAnswer: string) => void;
  accessAnswersWithQuestionIndex?: boolean;
  indexOffset?: number; // Only valid when `accessAnswersWithQuestionIndex` is true
  isReadonly: boolean;
};

/**
 * Render a list of questions that users can interact with (i.e. can input answers)
 * @param param0.questions List of questions to render
 * @param param0.answers Object of answers where key is (question ID OR question index) and value is the answer to the question.
 * (For 'Checkboxes' questions, the answer is stored as a stringifed JSON object where the key is the option and the value is 'true' is the option is selected)
 * @param param0.generateSetAnswer Generates the set answer callback based on the question ID or index
 * @param param0.accessAnswersWithQuestionIndex If true, access a question's answer via the question index; Else access a question's answer via the question ID
 * @param param0.indexOffset Used to offset the question index
 * @param param0.isReadonly If true, answers cannot be edited
 */
const QuestionsList: FC<Props> = ({
  questions,
  answers,
  generateSetAnswer,
  accessAnswersWithQuestionIndex = false,
  indexOffset,
  isReadonly,
}) => {
  return (
    <Stack spacing="1rem">
      {questions.map((question, idx) => {
        /**
         * In preview mode (question is of type LeanQuestion instead of type Question) while editing Deadline questions,
         * the answer is stored and accessed via its index because it does not have a questionId yet.
         * Else it is stored and accessed via its questionId.
         * (The index is offset as )
         */
        let questionIdOrIdx;
        if (!accessAnswersWithQuestionIndex) {
          if (isQuestion(question)) {
            questionIdOrIdx = question.id;
          } else {
            return alert(
              "You should not enable the `accessAnswersWithQuestionIndex` flag if the questions do not have an ID. (i.e. edit deadline questions page)"
            );
          }
        } else {
          if (indexOffset !== undefined) {
            questionIdOrIdx = indexOffset + idx;
          } else {
            return alert(
              "You should not enable the `accessAnswersWithQuestionIndex` flag without providing the indexOffset"
            );
          }
        }

        const answer = answers.get(questionIdOrIdx);
        const setAnswer = generateSetAnswer
          ? generateSetAnswer(questionIdOrIdx)
          : undefined;

        return (
          <QuestionCard
            key={idx}
            idx={idx}
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            isReadonly={isReadonly}
          />
        );
      })}
    </Stack>
  );
};
export default QuestionsList;
