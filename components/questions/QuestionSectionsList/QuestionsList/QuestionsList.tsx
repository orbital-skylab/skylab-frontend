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
  errors?: Record<string, boolean>;
  onClearError?: (id: number) => void;
};

/**
 * Get the question identifier based on the `accessAnswersWithQuestionIndex` flag. If the flag is false, the identifier is the question ID; if true, the identifier is the question index (offset by `indexOffset` if provided).
 * @param question The question object
 * @param idx The index of the question in the list
 * @param accessByIndex Whether to access answers by index instead of question ID
 * @param offset The offset to apply to the index if accessing by index
 * @returns The question identifier (either question ID or index) or null if there's an error in configuration
 */
const getQuestionIdentifier = (
  question: Question | LeanQuestion,
  idx: number,
  accessByIndex: boolean,
  offset?: number
): number | null => {
  if (!accessByIndex) {
    if (!isQuestion(question)) {
      console.error(
        "`accessAnswersWithQuestionIndex` cannot be false if questions lack an ID."
      );
      return null;
    }
    return question.id;
  }

  if (offset === undefined) {
    console.error(
      "`accessAnswersWithQuestionIndex` is enabled, but `indexOffset` is undefined."
    );
    return null;
  }

  return offset + idx;
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
  errors = {},
  onClearError,
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
        const questionIdOrIdx = getQuestionIdentifier(
          question,
          idx,
          accessAnswersWithQuestionIndex,
          indexOffset
        );

        if (questionIdOrIdx === null) {
          return null; // Skip rendering this question due to configuration error
        }

        const answer = answers.get(questionIdOrIdx);
        const setAnswer = generateSetAnswer
          ? generateSetAnswer(questionIdOrIdx)
          : undefined;
        return (
          <QuestionCard
            key={questionIdOrIdx}
            idx={idx}
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            isReadonly={isReadonly}
            hasError={!!errors[questionIdOrIdx]}
            onClearError={() => onClearError && onClearError(questionIdOrIdx)}
          />
        );
      })}
    </Stack>
  );
};
export default QuestionsList;
