import { FC } from "react";
import { Stack } from "@mui/material";
import { LeanQuestion, Question } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import QuestionCard from "../../../questions/QuestionCard";
import { isQuestion } from "@/helpers/types";
import {
  QuestionErrorState,
  QuestionVerificationState,
} from "../../QuestionSectionsList/QuestionSectionsList";

type Props = {
  questions: (LeanQuestion | Question)[];
  answers: Map<Answer["questionId"], Answer["answer"]>;
  generateSetAnswer?: (questionId: number) => (newAnswer: string) => void;
  accessAnswersWithQuestionIndex?: boolean;
  indexOffset?: number;
  isReadonly?: boolean;
  errors?: Record<string, QuestionErrorState>;
  onClearError?: (questionKey: number | string) => void;
  verificationResults?: Record<string, QuestionVerificationState>;
  setVerificationResult?: (
    questionKey: number | string,
    result: QuestionVerificationState
  ) => void;
};

const QuestionsList: FC<Props> = ({
  questions,
  answers,
  generateSetAnswer,
  accessAnswersWithQuestionIndex = false,
  indexOffset = 0,
  isReadonly = false,
  errors = {},
  onClearError,
  verificationResults = {},
  setVerificationResult,
}) => {
  return (
    <Stack spacing={2}>
      {questions.map((question, idx) => {
        const questionKey = accessAnswersWithQuestionIndex
          ? indexOffset + idx
          : isQuestion(question)
          ? question.id
          : idx;

        const answer = answers.get(questionKey) ?? "";

        const setAnswer = generateSetAnswer
          ? generateSetAnswer(questionKey)
          : () => undefined;

        const questionError = errors[String(questionKey)];
        const verificationResult = verificationResults[String(questionKey)];

        return (
          <QuestionCard
            key={String(questionKey)}
            question={question}
            idx={accessAnswersWithQuestionIndex ? indexOffset + idx : idx}
            answer={answer}
            setAnswer={setAnswer}
            isReadonly={isReadonly}
            hasError={Boolean(questionError?.hasError)}
            errorMessage={questionError?.message}
            onClearError={() => onClearError?.(questionKey)}
            verificationResult={verificationResult}
            setVerificationResult={(result) =>
              setVerificationResult?.(questionKey, result)
            }
          />
        );
      })}
    </Stack>
  );
};

export default QuestionsList;
