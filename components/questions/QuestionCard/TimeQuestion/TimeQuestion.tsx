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
};

const TimeQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <Stack spacing="0.5rem" sx={{ width: "100%" }}>
      <QuestionAndDesc question={question} questionType="Time" />
      <TextField
        value={answer}
        onChange={handleChange}
        type="time"
        size="small"
        inputProps={{
          readOnly: isReadonly,
        }}
      />
    </Stack>
  );
};

export default TimeQuestion;
