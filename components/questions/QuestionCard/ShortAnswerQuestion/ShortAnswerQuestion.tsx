import { ChangeEvent, FC } from "react";
// Components
import AnonymousChip from "../AnonymousChip";
import { Stack, TextField, Typography } from "@mui/material";
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
    <Stack spacing="0.5rem" sx={{ width: "100%" }}>
      <Stack direction="row" spacing="0.25rem">
        <Typography fontWeight={600}>
          {question.question
            ? question.question
            : "<Empty Short Answer Question>"}
        </Typography>
        {question.isAnonymous && <AnonymousChip />}
      </Stack>
      {question.desc ? (
        <Typography variant="caption">{question.desc}</Typography>
      ) : null}

      <TextField
        value={answer}
        onChange={handleChange}
        size="small"
        placeholder="Your answer here"
      />
    </Stack>
  );
};
export default ShortAnswerQuestion;
