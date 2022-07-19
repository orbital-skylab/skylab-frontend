import { FC } from "react";
// Components
import { Stack, TextField } from "@mui/material";
// Helpers
import { generateHandleTextFieldChange } from "../QuestionCard.helpers";
// Types
import { LeanQuestion } from "@/types/deadlines";

type Props = {
  question: LeanQuestion;
  setQuestion: (question?: LeanQuestion) => void;
};

const EditQuestionWithNoOptions: FC<Props> = ({ question, setQuestion }) => {
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
    </Stack>
  );
};
export default EditQuestionWithNoOptions;
