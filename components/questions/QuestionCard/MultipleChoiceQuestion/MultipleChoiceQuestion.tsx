import { ChangeEvent, FC } from "react";
// Components
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import QuestionAndDesc from "../QuestionAndDesc";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
};

const MultipleChoiceQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <Stack className="mcq-question" spacing="0.5rem" sx={{ width: "100%" }}>
      <QuestionAndDesc question={question} questionType="Multiple Choice" />
      <FormControl>
        <RadioGroup value={answer} onChange={handleChange}>
          {question.options ? (
            <>
              {question.options.map((option, idx) => (
                <FormControlLabel
                  className="mcq-option"
                  key={idx}
                  value={option}
                  control={
                    <Radio
                      sx={{ flex: "0 0 fit-content" }}
                      readOnly={isReadonly}
                    />
                  }
                  label={option ? option : `<Empty Option ${idx + 1}>`}
                />
              ))}
            </>
          ) : (
            <Typography>No options were provided</Typography>
          )}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};
export default MultipleChoiceQuestion;
