import { ChangeEvent, FC, useState } from "react";
// Components
import { Link, Stack, TextField } from "@mui/material";
import QuestionAndDesc from "../QuestionAndDesc/QuestionAndDesc";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";
import { validateUrl } from "@/helpers/string";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
};

const UrlQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
}) => {
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
      <QuestionAndDesc question={question} questionType="URL" />
      {!isReadonly ? (
        <TextField
          value={answer}
          onChange={handleChange}
          size="small"
          placeholder="Your URL here"
          error={isInvalid}
          helperText={isInvalid && "Please enter a valid URL"}
        />
      ) : (
        <Link href={answer} target="_blank" rel="noreferrer">
          {answer}
        </Link>
      )}
    </Stack>
  );
};

export default UrlQuestion;
