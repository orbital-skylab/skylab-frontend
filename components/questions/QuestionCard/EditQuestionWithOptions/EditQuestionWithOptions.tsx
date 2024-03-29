import { FC, useCallback } from "react";
// Components
import { Button, Stack, TextField, Typography } from "@mui/material";
import EditOptionsList from "./EditOptionsList";
// Helpers
import { generateHandleTextFieldChange } from "../QuestionCard.helpers";
// Types
import { LeanQuestion } from "@/types/deadlines";
import { Add } from "@mui/icons-material";

type Props = {
  question: LeanQuestion;
  setQuestion: (question?: LeanQuestion) => void;
  isShowingSettings: boolean;
};

const EditQuestionWithOptions: FC<Props> = ({
  question,
  setQuestion,
  isShowingSettings,
}) => {
  /** Function to set an option at a specific index so that each option only receives the setter they need */
  const generateSetOption = useCallback(
    (idx: number) => {
      const setOption = (newOption?: string) => {
        const newQuestion = { ...question };
        if (!newQuestion.options) {
          newQuestion.options = [];
        }
        if (newOption !== undefined) {
          newQuestion.options.splice(idx, 1, newOption);
        } else {
          // Delete option
          newQuestion.options.splice(idx, 1);
        }
        setQuestion(newQuestion);
      };

      return setOption;
    },
    [question, setQuestion]
  );

  const addOption = () => {
    const newQuestion = { ...question };
    if (!newQuestion.options) {
      newQuestion.options = [];
    }
    newQuestion.options.push("");
    setQuestion(newQuestion);
  };

  return (
    <Stack spacing="1rem" sx={{ width: "100%" }}>
      <TextField
        className="question-input"
        label="Question"
        value={question.question}
        onChange={generateHandleTextFieldChange(
          question,
          setQuestion,
          "question"
        )}
        size="small"
      />
      <TextField
        className="question-description-input"
        label="Description"
        value={question.desc}
        multiline
        rows={3}
        onChange={generateHandleTextFieldChange(question, setQuestion, "desc")}
        size="small"
      />

      <Stack spacing="0.5rem">
        <Typography fontWeight={600}>Options</Typography>
        <EditOptionsList
          options={question.options}
          generateSetOption={generateSetOption}
          isOnlyOption={question.options?.length === 1}
        />
        {isShowingSettings && (
          <Button
            className="add-option-button"
            onClick={addOption}
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ width: "fit-content" }}
          >
            <Add />
            Option
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
export default EditQuestionWithOptions;
