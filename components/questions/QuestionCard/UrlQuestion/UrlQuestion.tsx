import { ChangeEvent, FC, useState } from "react";
// Components
import { Link, Stack, TextField, Typography } from "@mui/material";
import QuestionAndDesc from "../QuestionAndDesc/QuestionAndDesc";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";
import { validateUrl } from "@/helpers/string";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
  hasError?: boolean;
  onClearError?: () => void;
};

const UrlQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
  hasError = false,
  onClearError,
}) => {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!touched) {
      setTouched(true);
    }
    setAnswer(e.target.value);
    if (hasError && onClearError) {
      onClearError();
    }
  };

  const isUrlFormatInvalid = touched && !validateUrl(answer);
  const showRedBorder = isUrlFormatInvalid || hasError;

  return (
    <Stack className="url-question" spacing="0.5rem" sx={{ width: "100%" }}>
      <QuestionAndDesc question={question} questionType="URL" />
      {!isReadonly ? (
        <>
          <TextField
            className="url-input"
            value={answer}
            onChange={handleChange}
            size="small"
            type="url"
            placeholder="Your URL here"
            error={showRedBorder}
            helperText={
              (isUrlFormatInvalid && "Please enter a valid URL") ||
              (hasError && "This field is required")
            }
          />
        </>
      ) : (
        <Typography>
          {answer !== "" ? (
            <Link href={answer} target="_blank" rel="noreferrer">
              {answer}
            </Link>
          ) : (
            "No URL was provided"
          )}
        </Typography>
      )}
    </Stack>
  );
};

export default UrlQuestion;
