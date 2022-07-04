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
import AnonymousChip from "../AnonymousChip";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
};

const MultipleChoiceQuestion: FC<Props> = ({ question, answer, setAnswer }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <Stack spacing="0.5rem" sx={{ width: "100%" }}>
      <Stack direction="row" spacing="0.25rem">
        <Typography fontWeight={600}>
          {question.question
            ? question.question
            : "<Empty Multiple Choice Question>"}
        </Typography>
        {question.isAnonymous && <AnonymousChip />}
      </Stack>
      {question.desc ? (
        <Typography variant="caption">{question.desc}</Typography>
      ) : null}
      <FormControl>
        <RadioGroup value={answer} onChange={handleChange}>
          {question.options ? (
            <>
              {question.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
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
