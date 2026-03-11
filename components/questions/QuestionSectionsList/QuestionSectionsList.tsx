import { FC, useState } from "react";
// Components
import QuestionsList from "./QuestionsList";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// Helpers
import { isSection, isQuestion } from "@/helpers/types";
import { generateIndexOffset } from "@/hooks/useAnswers/useAnswers.helpers";
// Types
import { UseAnswersActions } from "@/hooks/useAnswers";
import {
  LeanQuestion,
  LeanSection,
  Question,
  QUESTION_TYPE,
  Section,
} from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";

type Props = {
  questionSections: (Section | LeanSection)[];
  answers: Map<Answer["questionId"], Answer["answer"]>;
  accessAnswersWithQuestionIndex?: boolean;
  answersActions?: UseAnswersActions;
  submitAnswers?: (options?: {
    isDraft?: boolean;
    shouldDisplaySuccess?: boolean;
  }) => void;
  isSubmitting?: boolean;
  isReadonly?: boolean;
  isDraft?: boolean;
  includeAnonymousQuestions?: boolean;
  isApplication?: boolean;
};

const QuestionSectionsList: FC<Props> = ({
  questionSections,
  answers,
  accessAnswersWithQuestionIndex,
  answersActions,
  submitAnswers,
  isSubmitting,
  isApplication = false,
  isReadonly = false,
  isDraft = true,
  includeAnonymousQuestions = false,
}) => {
  const { setError } = useSnackbarAlert();
  const [questionErrors, setQuestionErrors] = useState<Record<string, boolean>>(
    {}
  );

  /**
   * Clear error for a question
   * @param questionId ID of the question to clear error for
   */
  const handleClearError = (questionId: number) => {
    if (questionErrors[questionId]) {
      setQuestionErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const getSectionNumber = (section: Section | LeanSection, idx: number) => {
    if (isSection(section)) {
      return section.sectionNumber;
    } else if (idx !== undefined) {
      return idx + 1;
    } else {
      return -1;
    }
  };

  const isAnswerEmpty = (
    question: LeanQuestion | Question,
    answer: string | undefined
  ): boolean => {
    if (answer === undefined || answer === null) return true;

    switch (question.type) {
      case QUESTION_TYPE.CHECKBOXES:
        try {
          const answerObj =
            typeof answer === "string" ? JSON.parse(answer) : answer;
          return !Object.values(answerObj).some((val) => val === true);
        } catch {
          return true;
        }
      case QUESTION_TYPE.RICH_TEXT_EDITOR:
        return answer.replace(/<[^>]*>/g, "").trim() === "";
      default:
        return String(answer).trim() === "";
    }
  };

  /**
   * Get the label to display for a question, falling back to question type or a default if question text is not available.
   *
   * @param q The question to get the label for.
   * @returns The label to display for the question.
   */
  const getQuestionLabel = (q: LeanQuestion | Question) => {
    if (typeof q.question === "string" && q.question.trim().length > 0) {
      return q.question;
    }

    if (isQuestion(q) && q.type) {
      return q.type;
    }

    return "Untitled question";
  };

  const handleValidationAndSubmit = () => {
    if (!submitAnswers) return;

    setQuestionErrors({});

    const questionsWithKeys = questionSections.flatMap(
      (section, sectionIdx) => {
        const indexOffset = accessAnswersWithQuestionIndex
          ? generateIndexOffset(questionSections, sectionIdx)
          : 0;

        return section.questions.map((q, qIdx) => {
          const key = accessAnswersWithQuestionIndex
            ? indexOffset + qIdx
            : isQuestion(q)
            ? q.id
            : null;

          return { question: q, key };
        });
      }
    );

    const requiredQuestions = questionsWithKeys.filter(
      ({ question: q }) =>
        q.isRequired && (!q.isAnonymous || includeAnonymousQuestions)
    );

    const missingItems = requiredQuestions.filter(({ question, key }) => {
      if (key === null) return false;

      const answer = answers.get(key);
      return isAnswerEmpty(question, answer);
    });

    if (missingItems.length > 0) {
      const newErrors: Record<string, boolean> = {};
      missingItems.forEach(({ key }) => {
        if (key !== null) {
          newErrors[key] = true;
        }
      });
      setQuestionErrors(newErrors);

      const firstFewNames = missingItems
        .slice(0, 3)
        .map(({ question }) => `"${getQuestionLabel(question)}"`)
        .join(", ");

      if (missingItems.length <= 3) {
        setError(`Please fill in: ${firstFewNames}`);
      } else {
        const remainingCount = missingItems.length - 3;
        setError(
          `Please fill in: ${firstFewNames} and ${remainingCount} others.`
        );
      }
      return;
    }

    submitAnswers({ isDraft: false, shouldDisplaySuccess: true });
  };

  return (
    <Stack id="question-section-list-div" sx={{ gap: "2rem" }}>
      {questionSections.map((section: LeanSection, idx) => {
        const { name, desc, questions } = section;
        const sectionNumber = getSectionNumber(section, idx);
        // The amount to offset each question based on number of previous questions
        const indexOffset = accessAnswersWithQuestionIndex
          ? generateIndexOffset(questionSections, idx)
          : 0;

        return (
          <Card
            className="section-div"
            key={sectionNumber}
            sx={{
              borderLeft: 5,
              borderColor: "primary.main",
              position: "relative",
              overflow: "visible",
              marginTop: "40px",
            }}
          >
            <Typography
              className="section-number-span"
              sx={{
                padding: "0.5rem 1rem",
                position: "absolute",
                bottom: "100%",
                backgroundColor: "primary.main",
                color: "white",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
              }}
              fontWeight={600}
            >{`Section ${sectionNumber} of ${questionSections.length}`}</Typography>
            <CardContent>
              <Stack spacing="0.5rem" marginBottom="1rem">
                <Typography
                  className="section-name-span"
                  fontWeight={600}
                  fontSize="1.2rem"
                >
                  {name
                    ? name
                    : "<Empty Section Name> (Will not be saved if a name is not provided)"}
                </Typography>
                {desc && (
                  <Typography
                    className="section-description-span"
                    variant="body1"
                    sx={{ whiteSpace: "pre-line" }}
                  >
                    {desc}
                  </Typography>
                )}
              </Stack>

              <QuestionsList
                questions={questions.filter(
                  (question) =>
                    !question.isAnonymous || includeAnonymousQuestions
                )}
                answers={answers}
                generateSetAnswer={answersActions?.generateSetAnswer}
                accessAnswersWithQuestionIndex={accessAnswersWithQuestionIndex}
                indexOffset={indexOffset}
                isReadonly={Boolean(isReadonly)}
                errors={questionErrors}
                onClearError={handleClearError}
              />
            </CardContent>
          </Card>
        );
      })}
      {!isReadonly && (
        <Stack
          direction="row"
          justifyContent="end"
          alignItems="center"
          gap="1rem"
        >
          {isDraft && (
            <LoadingButton
              id="save-draft-button"
              onClick={
                submitAnswers
                  ? () =>
                      submitAnswers({
                        isDraft: true,
                        shouldDisplaySuccess: true,
                      })
                  : undefined
              }
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Draft
            </LoadingButton>
          )}
          <LoadingButton
            id="submit-submission-button"
            variant="contained"
            onClick={handleValidationAndSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isApplication ? "Apply" : isDraft ? "Submit" : "Update"}
          </LoadingButton>
        </Stack>
      )}
    </Stack>
  );
};
export default QuestionSectionsList;
