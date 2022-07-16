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
};

const DateQuestion: FC<Props> = ({ question, answer, setAnswer }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <Stack spacing="0.5rem" sx={{ width: "100%" }}>
      <QuestionAndDesc question={question} questionType="Date" />
      <TextField
        value={answer}
        onChange={handleChange}
        type="date"
        size="small"
      />
    </Stack>
  );
};

export default DateQuestion;
