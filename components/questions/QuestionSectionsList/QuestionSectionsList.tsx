import { FC } from "react";
// Components
import QuestionsList from "./QuestionsList";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// Helpers
import { isSection, isQuestion } from "@/helpers/types";
import { generateIndexOffset } from "@/hooks/useAnswers/useAnswers.helpers";
// Types
import { UseAnswersActions } from "@/hooks/useAnswers";
import { LeanSection, QUESTION_TYPE, Section } from "@/types/deadlines";
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
  const getSectionNumber = (section: Section | LeanSection, idx: number) => {
    if (isSection(section)) {
      return section.sectionNumber;
    } else if (idx !== undefined) {
      return idx + 1;
    } else {
      return -1;
    }
  };

  const handleValidationAndSubmit = () => {
    if (!submitAnswers) return;

    const allQuestions = questionSections.flatMap(
      (section) => section.questions
    );

    const firstMissingQuestion = allQuestions.find((question, index) => {
      if (!question.isRequired) return false;

      if (question.isAnonymous && !includeAnonymousQuestions) return false;

      let answer: string | undefined;

      if (accessAnswersWithQuestionIndex) {
        answer = answers.get(index);
      } else {
        if (isQuestion(question)) {
          answer = answers.get(question.id);
        } else {
          // Cannot validate LeanQuestion without index mode
          return false;
        }
      }

      if (answer === undefined || answer === null) return true;

      switch (question.type) {
        case QUESTION_TYPE.CHECKBOXES:
          try {
            const answerObj = JSON.parse(answer);
            const hasCheckedOption = Object.values(answerObj).some(
              (val) => val === true
            );
            return !hasCheckedOption;
          } catch (e) {
            return true;
          }

        case QUESTION_TYPE.RICH_TEXT_EDITOR: {
          const strippedContent = answer.replace(/<[^>]*>/g, "").trim();
          return strippedContent === "";
        }

        case QUESTION_TYPE.SHORT_ANSWER:
        case QUESTION_TYPE.PARAGRAPH:
        case QUESTION_TYPE.URL:
        case QUESTION_TYPE.DROPDOWN:
        case QUESTION_TYPE.MULTIPLE_CHOICE:
        case QUESTION_TYPE.DATE:
        case QUESTION_TYPE.TIME:
        default:
          return answer.trim() === "";
      }
    });

    if (firstMissingQuestion) {
      setError(
        `Please fill in the required question: "${firstMissingQuestion.question}"`
      );
      return;
    }

    submitAnswers({
      isDraft: false,
      shouldDisplaySuccess: true,
    });
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
