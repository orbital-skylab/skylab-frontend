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
import RichTextEditorQuestion from "./RichTextEditorQuestion";
import { QuestionVerificationState } from "../QuestionSectionsList/QuestionSectionsList";

type Props = {
  isEditMode?: boolean;
  isShowingSettings?: boolean;
  question: LeanQuestion | Question;
  idx?: number;
  setQuestion?: (question?: LeanQuestion) => void;
  answer?: Option;
  setAnswer?: (newAnswer: string) => void;
  isReadonly?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  verificationResult?: QuestionVerificationState;
  setVerificationResult?: (result: QuestionVerificationState) => void;
  onClearError?: () => void;
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
  isReadonly,
  hasError = false,
  errorMessage,
  verificationResult,
  setVerificationResult,
  onClearError,
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
        case QUESTION_TYPE.RICH_TEXT_EDITOR:
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

        default:
          return null;
      }
    }

    if (answer === undefined) {
      return alert(
        `Error with question: ${getQuestionNumber()}: The answer at the questionIdOrIdx is undefined`
      );
    }

    if (!setAnswer) {
      return alert(
        `Error with question: ${getQuestionNumber()}: An answer setter is not provided`
      );
    }

    const questionProps = {
      question,
      answer,
      setAnswer,
      isReadonly: Boolean(isReadonly),
      hasError,
      errorMessage,
      onClearError,
    };

    switch (question.type) {
      case QUESTION_TYPE.SHORT_ANSWER:
        return <ShortAnswerQuestion {...questionProps} />;

      case QUESTION_TYPE.PARAGRAPH:
        return <ParagraphQuestion {...questionProps} />;

      case QUESTION_TYPE.URL:
        return (
          <UrlQuestion
            {...questionProps}
            verificationResult={verificationResult}
            setVerificationResult={setVerificationResult}
          />
        );

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

      case QUESTION_TYPE.RICH_TEXT_EDITOR:
        return <RichTextEditorQuestion {...questionProps} />;

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent sx={{ display: "flex", gap: "1rem" }}>
        <Typography
          sx={{
            paddingTop: isEditMode ? "0.5rem" : "",
            marginRight: "-0.5rem",
          }}
          fontWeight={600}
        >
          {getQuestionNumber()}.
        </Typography>

        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
