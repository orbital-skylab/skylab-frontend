import { FC } from "react";
// Components
import QuestionCard from "@/components/questions/QuestionCard";
import { Stack } from "@mui/material";
// Types
import { LeanQuestion } from "@/types/deadlines";

type Props = {
  questions: LeanQuestion[];
  generateSetQuestion: (idx: number) => (question?: LeanQuestion) => void;
};

const EditQuestionsList: FC<Props> = ({ questions, generateSetQuestion }) => {
  return (
    <Stack spacing="1rem">
      {questions.map((question, idx) => (
        <QuestionCard
          key={idx}
          questionNumber={idx + 1}
          question={question}
          setQuestion={generateSetQuestion(idx)}
          isEditMode
        />
      ))}
    </Stack>
  );
};
export default EditQuestionsList;
