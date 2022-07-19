import { ChangeEvent, FC, useState } from "react";
// Components
import { Stack, TextField } from "@mui/material";
import QuestionAndDesc from "../QuestionAndDesc/QuestionAndDesc";
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
    <Stack className="url-question" spacing="0.5rem" sx={{ width: "100%" }}>
      <QuestionAndDesc question={question} questionType="URL" />
      <TextField
        className="url-input"
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
