import { FC } from "react";
// Components
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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

const CheckboxesQuestion: FC<Props> = ({ question, answer, setAnswer }) => {
  const isChecked = (option: string) => {
    try {
      const answerObject = JSON.parse(answer);
      return !!answerObject[option];
    } catch {
      return false;
    }
  };

  const generateToggle = (option: string) => {
    const toggleCheck = () => {
      let answerObject;
      try {
        answerObject = JSON.parse(answer);
      } catch {
        answerObject = {};
      }

      if (answerObject[option]) {
        delete answerObject[option];
      } else {
        answerObject[option] = true;
      }
      setAnswer(JSON.stringify(answerObject));
    };
    return toggleCheck;
  };

  return (
    <Stack spacing="0.5rem" sx={{ width: "100%" }}>
      <Stack direction="row" spacing="0.25rem">
        <Typography fontWeight={600}>
          {question.question
            ? question.question
            : "<Empty Checkboxes Question>"}
        </Typography>
        {question.isAnonymous && <AnonymousChip />}
      </Stack>
      {question.desc ? (
        <Typography variant="caption">{question.desc}</Typography>
      ) : null}
      <FormControl>
        <FormGroup>
          {question.options ? (
            <>
              {question.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  label={option}
                  control={<Checkbox checked={isChecked(option)} />}
                  onClick={generateToggle(option)}
                />
              ))}
            </>
          ) : (
            <Typography>No options were provided</Typography>
          )}
        </FormGroup>
      </FormControl>
    </Stack>
  );
};
export default CheckboxesQuestion;
