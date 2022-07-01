import { ChangeEvent, FC } from "react";
// Components
import { Stack, TextField, Typography } from "@mui/material";
import AnonymousChip from "../AnonymousChip";
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
      <Stack direction="row" spacing="0.25rem">
        <Typography fontWeight={600}>
          {question.question ? question.question : "<Empty Date Question>"}
        </Typography>
        {question.isAnonymous && <AnonymousChip />}
      </Stack>
      {question.desc ? (
        <Typography variant="caption">{question.desc}</Typography>
      ) : null}
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
