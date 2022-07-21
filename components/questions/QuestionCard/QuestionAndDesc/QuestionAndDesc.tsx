import { LeanQuestion, Question } from "@/types/deadlines";
import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import AnonymousChip from "../AnonymousChip";

type Props = {
  question: LeanQuestion | Question;
  questionType: string;
};

const QuestionAndDesc: FC<Props> = ({ question, questionType }) => {
  return (
    <>
      <Stack direction="row" spacing="0.25rem">
        <Typography fontWeight={600}>
          {question.question
            ? question.question
            : `<Empty ${questionType} Question> (Will not be saved if a question is not provided)`}
        </Typography>
        {question.isAnonymous && <AnonymousChip />}
      </Stack>
      {question.desc && (
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {question.desc}
        </Typography>
      )}
    </>
  );
};
export default QuestionAndDesc;
