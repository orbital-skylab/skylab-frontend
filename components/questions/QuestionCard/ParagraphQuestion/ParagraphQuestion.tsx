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

const ParagraphQuestion: FC<Props> = ({ question, answer, setAnswer }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <Stack
      className="paragraph-question"
      spacing="0.5rem"
      sx={{ width: "100%" }}
    >
      <QuestionAndDesc question={question} questionType="Paragraph" />
      <TextField
        className="paragraph-input"
        value={answer}
        onChange={handleChange}
        size="small"
        multiline
        rows={3}
        placeholder="Your answer here"
      />
    </Stack>
  );
};
export default ParagraphQuestion;
