import { FC } from "react";
// Components
import QuestionCard from "@/components/questions/QuestionCard";
import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
// Types
import { LeanQuestion } from "@/types/deadlines";

type Props = {
  questions: LeanQuestion[];
  generateSetQuestion: (idx: number) => (question?: LeanQuestion) => void;
};

const EditQuestionsList: FC<Props> = ({ questions, generateSetQuestion }) => {
  return (
    <Stack spacing="1rem">
      <Stack spacing="1rem">
        {questions.map((question, idx) => (
          <QuestionCard
            key={idx}
            idx={idx}
            question={question}
            setQuestion={generateSetQuestion(idx)}
            isEditMode
          />
        ))}
        <Button
          variant="contained"
          size="small"
          sx={{ margin: "auto" }}
          onClick={() => alert("Create new question")}
        >
          <Add />
        </Button>
      </Stack>
    </Stack>
  );
};
export default EditQuestionsList;
