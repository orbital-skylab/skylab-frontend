import { FC } from "react";
// Components
import { Card, CardContent, Typography } from "@mui/material";
import EditQuestionConfig from "./EditQuestionConfig";
import EditQuestionWithNoOptions from "./EditQuestionWithNoOptions";
import EditQuestionWithOptions from "./EditQuestionWithOptions";
// Helpers
import { isQuestion } from "@/helpers/types";
// Types
import { LeanQuestion, Question, QUESTION_TYPE } from "@/types/deadlines";

type Props = {
  isEditMode?: boolean;
  setQuestion?: (question?: LeanQuestion) => void;
  questionNumber?: number;
  question: LeanQuestion | Question;
};

const QuestionCard: FC<Props> = ({
  isEditMode,
  setQuestion,
  questionNumber,
  question,
}) => {
  const getQuestionNumber = () => {
    if (isEditMode) {
      if (questionNumber === undefined) {
        return -1;
      }
      return questionNumber;
    } else {
      if (!isQuestion(question)) {
        return null;
      }
      return question.questionNumber;
    }
  };

  /** Render Question Content */
  const renderContent = () => {
    if (isEditMode) {
      if (!setQuestion) {
        return null;
      }
      const leanQuestion = question as LeanQuestion;
      switch (leanQuestion.type) {
        case QUESTION_TYPE.SHORT_ANSWER:
        case QUESTION_TYPE.PARAGRAPH:
        case QUESTION_TYPE.URL:
        case QUESTION_TYPE.DATE:
        case QUESTION_TYPE.TIME:
          return (
            <>
              <EditQuestionWithNoOptions
                question={leanQuestion}
                setQuestion={setQuestion}
              />
              <EditQuestionConfig
                question={question}
                setQuestion={setQuestion}
              />
            </>
          );

        case QUESTION_TYPE.MULTIPLE_CHOICE:
        case QUESTION_TYPE.CHECKBOXES:
        case QUESTION_TYPE.DROPDOWN:
          return (
            <>
              <EditQuestionWithOptions
                question={leanQuestion}
                setQuestion={setQuestion}
              />
              <EditQuestionConfig
                question={question}
                setQuestion={setQuestion}
              />
            </>
          );

        default:
          return null;
      }
    } else {
      /** Type checking to ensure that is not just a lean question but a question */
      if (!isQuestion(question)) {
        return null;
      }

      switch (question.type) {
        default:
          return null;
      }
    }
  };

  return (
    <Card>
      <CardContent sx={{ display: "flex", gap: "1rem" }}>
        {/* Question Number */}
        <Typography
          sx={{ paddingTop: "0.5rem", marginRight: "-0.5rem" }}
          fontWeight={600}
        >
          {getQuestionNumber()}.
        </Typography>

        {/* Question Content */}
        {renderContent()}
      </CardContent>
    </Card>
  );
};
export default QuestionCard;
