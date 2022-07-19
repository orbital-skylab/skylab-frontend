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

const ShortAnswerQuestion: FC<Props> = ({ question, answer, setAnswer }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
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
      />
    </Stack>
  );
};
export default ShortAnswerQuestion;
