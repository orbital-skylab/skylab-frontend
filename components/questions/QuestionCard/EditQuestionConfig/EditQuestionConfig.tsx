import { ChangeEvent, FC } from "react";
// Components
import { Delete } from "@mui/icons-material";
import {
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
// Helpers
import { splitOnCapital } from "@/helpers/string";
// Types
import { LeanQuestion, QUESTION_TYPE } from "@/types/deadlines";

type Props = {
  question: LeanQuestion;
  setQuestion: (question?: LeanQuestion) => void;
};

const EditQuestionConfig: FC<Props> = ({ question, setQuestion }) => {
  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuestion: LeanQuestion = { ...question };
    newQuestion.type = e.target.value as QUESTION_TYPE;
    setQuestion(newQuestion);
  };

  const handleToggleAnonymous = () => {
    const newQuestion: LeanQuestion = { ...question };
    newQuestion.isAnonymous = !question.isAnonymous;
    setQuestion(newQuestion);
  };

  const handleToggleRequired = () => {
    const newQuestion: LeanQuestion = { ...question };
    newQuestion.isRequired = !question.isRequired;
    setQuestion(newQuestion);
  };

  const handleDeleteQuestion = () => {
    setQuestion();
  };

  return (
    <Stack sx={{ width: "40%" }}>
      <TextField
        className="question-type-select"
        label="Question Type"
        value={question.type}
        onChange={handleTypeChange}
        select
        size="small"
        fullWidth
      >
        {Object.values(QUESTION_TYPE).map((questionType) => (
          <MenuItem key={questionType} value={questionType}>
            {splitOnCapital(questionType)}
          </MenuItem>
        ))}
      </TextField>

      <Stack
        justifyContent="space-between"
        marginTop="auto"
        flexDirection="row"
      >
        <Tooltip
          title="An anonymous question means that the receiver of the question will not be able to see who it is from"
          placement="top"
        >
          <FormControlLabel
            value={question.isAnonymous}
            onClick={handleToggleAnonymous}
            checked={question.isAnonymous}
            control={<Switch color="secondary" size="small" />}
            label="Anonymous"
            labelPlacement="start"
          />
        </Tooltip>
        <Tooltip
          title="A required question means that the receiver of the question must answer this question before submitting"
          placement="top"
        >
          <FormControlLabel
            value={question.isRequired}
            onClick={handleToggleRequired}
            checked={question.isRequired}
            control={<Switch color="secondary" size="small" />}
            label="Required"
            labelPlacement="start"
          />
        </Tooltip>
        <Tooltip title="Delete Question" placement="top">
          <IconButton color="error" onClick={handleDeleteQuestion}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
export default EditQuestionConfig;
