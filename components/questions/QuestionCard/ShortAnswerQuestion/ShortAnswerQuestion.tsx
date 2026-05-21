import { ChangeEvent, FC } from "react";
// Components
import { Stack, TextField } from "@mui/material";
import QuestionAndDesc from "../QuestionAndDesc";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
  hasError?: boolean;
  onClearError?: () => void;
};

const ShortAnswerQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
  hasError = false,
  onClearError,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    if (hasError && onClearError) {
      onClearError();
    }
  };

  return (
    <Stack
      className="short-answer-question"
      spacing="0.5rem"
      sx={{ width: "100%" }}
    >
      <QuestionAndDesc question={question} questionType="Short Answer" />
      <TextField
        className="short-answer-input"
        value={answer}
        onChange={handleChange}
        size="small"
        placeholder="Your answer here"
        inputProps={{
          readOnly: isReadonly,
        }}
        error={hasError}
        helperText={hasError && "This field is required"}
      />
    </Stack>
  );
};
export default ShortAnswerQuestion;
