import { FC } from "react";
// Components
import QuestionCard from "@/components/questions/QuestionCard";
import { Add } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
// Types
import { LeanQuestion } from "@/types/deadlines";

type Props = {
  questions: LeanQuestion[];
  generateSetQuestion: (idx: number) => (question?: LeanQuestion) => void;
  addQuestion: () => void;
  isShowingSettings: boolean;
};

const EditQuestionsList: FC<Props> = ({
  questions,
  generateSetQuestion,
  addQuestion,
  isShowingSettings,
}) => {
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
            isShowingSettings={isShowingSettings}
          />
        ))}
        {questions.length === 0 && (
          <Typography
            fontWeight={600}
            variant="h6"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            There are no questions in this section
          </Typography>
        )}
        {isShowingSettings && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ width: "fit-content", alignSelf: "center" }}
            onClick={addQuestion}
          >
            <Add /> Question
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
export default EditQuestionsList;
