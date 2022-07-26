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
import QuestionAndDesc from "../QuestionAndDesc";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
};

const CheckboxesQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
}) => {
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
    <Stack
      className="checkbox-question"
      spacing="0.5rem"
      sx={{ width: "100%" }}
    >
      <QuestionAndDesc question={question} questionType="Checkboxes" />
      <FormControl>
        <FormGroup>
          {question.options ? (
            <>
              {question.options.map((option, idx) => (
                <FormControlLabel
                  className="checkbox-option"
                  key={idx}
                  label={option ? option : `<Empty Option ${idx + 1}>`}
                  control={
                    <Checkbox
                      checked={isChecked(option)}
                      readOnly={isReadonly}
                    />
                  }
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
