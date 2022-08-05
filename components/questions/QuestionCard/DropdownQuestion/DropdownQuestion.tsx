import { ChangeEvent, FC } from "react";
// Components
import { MenuItem, Stack, TextField } from "@mui/material";
import QuestionAndDesc from "../QuestionAndDesc";
// Types
import { LeanQuestion, Option, Question } from "@/types/deadlines";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
};

const DropdownQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <Stack
      className="dropdown-question"
      spacing="0.5rem"
      sx={{ width: "100%" }}
    >
      <QuestionAndDesc question={question} questionType="Dropdown" />
      <TextField
        className="dropdown-select"
        value={answer}
        onChange={handleChange}
        select
        inputProps={{ readOnly: isReadonly }}
      >
        {question.options &&
          question.options.map((option, idx) => (
            <MenuItem className="dropdown-option" value={option} key={idx}>
              {option ? option : `<Empty Option ${idx + 1}>`}
            </MenuItem>
          ))}
      </TextField>
      )
    </Stack>
  );
};
export default DropdownQuestion;
