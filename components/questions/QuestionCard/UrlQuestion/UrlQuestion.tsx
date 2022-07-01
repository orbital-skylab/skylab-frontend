import { ChangeEvent, FC, useState } from "react";
// Components
import { Stack, TextField, Typography } from "@mui/material";
import AnonymousChip from "../AnonymousChip";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";
import { validateUrl } from "@/helpers/string";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
};

const UrlQuestion: FC<Props> = ({ question, answer, setAnswer }) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!touched) {
      setTouched(true);
    }
    setAnswer(e.target.value);
  };

  const isInvalid = touched && !validateUrl(answer);

  return (
    <Stack spacing="0.5rem" sx={{ width: "100%" }}>
      <Stack direction="row" spacing="0.25rem">
        <Typography fontWeight={600}>
          {question.question ? question.question : "<Empty URL Question>"}
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
        placeholder="Your URL here"
        error={isInvalid}
        helperText={isInvalid && "Please enter a valid URL"}
      />
    </Stack>
  );
};

export default UrlQuestion;
