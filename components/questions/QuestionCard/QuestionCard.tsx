import { FC } from "react";
// Components
import { Card, CardContent, Typography } from "@mui/material";
import EditQuestionConfig from "./EditQuestionConfig";
import EditQuestionWithNoOptions from "./EditQuestionWithNoOptions";
import EditQuestionWithOptions from "./EditQuestionWithOptions";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import ParagraphQuestion from "./ParagraphQuestion";
import UrlQuestion from "./UrlQuestion";
// Helpers
import { isQuestion } from "@/helpers/types";
// Types
import {
  LeanQuestion,
  Option,
  Question,
  QUESTION_TYPE,
} from "@/types/deadlines";
import DateQuestion from "./DateQuestion";
import TimeQuestion from "./TimeQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import CheckboxesQuestion from "./CheckboxesQuestion";
import DropdownQuestion from "./DropdownQuestion";

type Props = {
  isEditMode?: boolean;
  isShowingSettings?: boolean; // Only valid when isEditMode === true
  question: LeanQuestion | Question;
  // Used to generate the question number if not provided. Only valid when editing Deadline questions
  idx?: number;
  // Only valid when isEditMode === true
  setQuestion?: (question?: LeanQuestion) => void;
  // Only valid when isEditMode === false
  answer?: Option;
  setAnswer?: (newAnswer: string) => void;
};

/**
 * This component renders the:
 * 1. Question in ANSWER form where users can type in inputs
 * 2. Question in EDIT form where users can edit the question
 */
const QuestionCard: FC<Props> = ({
  isEditMode,
  isShowingSettings,
  question,
  idx,
  setQuestion,
  answer,
  setAnswer,
}) => {
  const getQuestionNumber = () => {
    if (isQuestion(question)) {
      return question.questionNumber;
    } else if (idx !== undefined) {
      return idx + 1;
    } else {
      return -1;
    }
  };

  /** Render Question Content */
  const renderContent = () => {
    if (isEditMode) {
      if (!setQuestion) {
        return alert(
          `Error with question: ${getQuestionNumber()}: A question setter is not provided even though it is in Edit mode`
        );
      }

      const editQuestionProps = {
        question: question as LeanQuestion,
        setQuestion,
      };
      switch ((question as LeanQuestion).type) {
        case QUESTION_TYPE.SHORT_ANSWER:
        case QUESTION_TYPE.PARAGRAPH:
        case QUESTION_TYPE.URL:
        case QUESTION_TYPE.DATE:
        case QUESTION_TYPE.TIME:
          return (
            <>
              <EditQuestionWithNoOptions {...editQuestionProps} />
              {isShowingSettings && (
                <EditQuestionConfig {...editQuestionProps} />
              )}
            </>
          );
        case QUESTION_TYPE.MULTIPLE_CHOICE:
        case QUESTION_TYPE.CHECKBOXES:
        case QUESTION_TYPE.DROPDOWN:
          return (
            <>
              <EditQuestionWithOptions
                {...editQuestionProps}
                isShowingSettings={!!isShowingSettings}
              />
              {isShowingSettings && (
                <EditQuestionConfig {...editQuestionProps} />
              )}
            </>
          );
      }
    } else {
      if (answer === undefined || !setAnswer) {
        return alert(
          `Error with question: ${getQuestionNumber()}: A answer setter is not provided OR the answer at the questionIdOrIdx is undefined`
        );
      }

      const questionProps = { question, answer, setAnswer };
      switch (question.type) {
        case QUESTION_TYPE.SHORT_ANSWER:
          return <ShortAnswerQuestion {...questionProps} />;
        case QUESTION_TYPE.PARAGRAPH:
          return <ParagraphQuestion {...questionProps} />;
        case QUESTION_TYPE.URL:
          return <UrlQuestion {...questionProps} />;
        case QUESTION_TYPE.DATE:
          return <DateQuestion {...questionProps} />;
        case QUESTION_TYPE.TIME:
          return <TimeQuestion {...questionProps} />;
        case QUESTION_TYPE.MULTIPLE_CHOICE:
          return <MultipleChoiceQuestion {...questionProps} />;
        case QUESTION_TYPE.CHECKBOXES:
          return <CheckboxesQuestion {...questionProps} />;
        case QUESTION_TYPE.DROPDOWN:
          return <DropdownQuestion {...questionProps} />;
      }
    }
  };

  return (
    <Card>
      <CardContent sx={{ display: "flex", gap: "1rem" }}>
        {/* Question Number */}
        <Typography
          sx={{
            // To offset the TextField size while editing
            paddingTop: isEditMode ? "0.5rem" : "",
            marginRight: "-0.5rem",
          }}
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
