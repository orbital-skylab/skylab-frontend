import { FC, useState } from "react";
// Components
import QuestionsList from "./QuestionsList";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// Helpers
import { validateUrl } from "@/helpers/string";
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
  URL_TYPE,
  UrlValidationRules,
} from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import useApiCall from "@/hooks/useApiCall";
import { HTTP_METHOD } from "@/types/api";

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

export type VerifiedFile = {
  name: string;
  mimeType: string;
  size: number | null;
  imageMetadata?: {
    width?: number;
    height?: number;
    rotation?: number;
  } | null;
  videoMetadata?: {
    width?: number;
    height?: number;
    durationMillis?: number;
  } | null;
};

export type VerificationResponse = {
  verified: boolean;
  message: string;
  file: VerifiedFile | null;
  validation?: {
    isValid: boolean;
    errors: string[];
  };
};

export type QuestionVerificationState = {
  verified: boolean;
  message: string;
  file: VerifiedFile | null;
  validationErrors: string[];
};

export type QuestionErrorState = {
  hasError: boolean;
  message?: string;
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

  const [questionErrors, setQuestionErrors] = useState<
    Record<string, QuestionErrorState>
  >({});
  const [questionVerificationResults, setQuestionVerificationResults] =
    useState<Record<string, QuestionVerificationState>>({});
  const [isRevalidating, setIsRevalidating] = useState(false);

  const verifyDriveFile = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: "/submissions/verify-drive-file",
    requiresAuthorization: true,
  });

  const handleClearError = (questionKey: number | string) => {
    const normalisedKey = String(questionKey);

    setQuestionErrors((prev) => {
      if (!prev[normalisedKey]) return prev;

      const next = { ...prev };
      delete next[normalisedKey];
      return next;
    });
  };

  const handleSetVerificationResult = (
    questionKey: number | string,
    result: QuestionVerificationState
  ) => {
    setQuestionVerificationResults((prev) => ({
      ...prev,
      [String(questionKey)]: result,
    }));
  };

  const getSectionNumber = (section: Section | LeanSection, idx: number) => {
    if (isSection(section)) {
      return section.sectionNumber;
    }
    if (idx !== undefined) {
      return idx + 1;
    }
    return -1;
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

  const getQuestionLabel = (q: LeanQuestion | Question) => {
    if (typeof q.question === "string" && q.question.trim().length > 0) {
      return q.question;
    }

    if (isQuestion(q) && q.type) {
      return q.type;
    }

    return "Untitled question";
  };

  const buildVerifyPayload = (
    question: LeanQuestion | Question,
    answer: string
  ): {
    url: string;
    questionId?: number | string;
    urlType?: URL_TYPE;
    urlValidationRules?: UrlValidationRules;
  } => {
    if ("id" in question && question.id != null) {
      return {
        questionId: question.id,
        url: answer,
      };
    }

    return {
      url: answer,
      urlType: question.urlType,
      urlValidationRules: question.urlValidationRules,
    };
  };

  const shouldRevalidateQuestion = (
    question: LeanQuestion | Question,
    answer: string | undefined
  ) => {
    if (!answer || String(answer).trim() === "") return false;
    if (question.type !== QUESTION_TYPE.URL) return false;

    const effectiveUrlType = question.urlType ?? URL_TYPE.GENERIC;
    return (
      effectiveUrlType === URL_TYPE.IMAGE || effectiveUrlType === URL_TYPE.VIDEO
    );
  };

  const handleValidationAndSubmit = async () => {
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

    const visibleQuestions = questionsWithKeys.filter(
      ({ question }) => !question.isAnonymous || includeAnonymousQuestions
    );

    const requiredQuestions = visibleQuestions.filter(
      ({ question }) => question.isRequired
    );

    const missingItems = requiredQuestions.filter(({ question, key }) => {
      if (key === null) return false;
      const answer = answers.get(key);
      return isAnswerEmpty(question, answer);
    });

    if (missingItems.length > 0) {
      const newErrors: Record<string, QuestionErrorState> = {};

      missingItems.forEach(({ key }) => {
        if (key !== null) {
          newErrors[String(key)] = {
            hasError: true,
            message: "This field is required",
          };
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

    const invalidUrlItems = visibleQuestions.filter(({ question, key }) => {
      if (key === null || question.type !== QUESTION_TYPE.URL) return false;

      const answer = String(answers.get(key) ?? "").trim();
      if (answer === "") return false;

      return !validateUrl(answer);
    });

    if (invalidUrlItems.length > 0) {
      const newErrors: Record<string, QuestionErrorState> = {};

      invalidUrlItems.forEach(({ key }) => {
        if (key !== null) {
          newErrors[String(key)] = {
            hasError: true,
            message: "Please enter a valid URL",
          };
        }
      });

      setQuestionErrors(newErrors);

      const firstFewNames = invalidUrlItems
        .slice(0, 3)
        .map(({ question }) => `"${getQuestionLabel(question)}"`)
        .join(", ");

      if (invalidUrlItems.length <= 3) {
        setError(`Please fix the URL format for: ${firstFewNames}`);
      } else {
        const remainingCount = invalidUrlItems.length - 3;
        setError(
          `Please fix the URL format for: ${firstFewNames} and ${remainingCount} others.`
        );
      }
      return;
    }

    const urlQuestionsToRevalidate = visibleQuestions.filter(
      ({ question, key }) => {
        if (key === null) return false;
        const answer = answers.get(key);
        return shouldRevalidateQuestion(question, answer);
      }
    );

    if (urlQuestionsToRevalidate.length > 0) {
      try {
        setIsRevalidating(true);

        const verificationResults = await Promise.all(
          urlQuestionsToRevalidate.map(async ({ question, key }) => {
            const normalisedKey = String(key);
            const answer = String(answers.get(key as number) ?? "").trim();

            try {
              const response = (await verifyDriveFile.call(
                buildVerifyPayload(question, answer)
              )) as VerificationResponse;

              return {
                key: normalisedKey,
                question,
                response,
              };
            } catch {
              return {
                key: normalisedKey,
                question,
                response: {
                  verified: false,
                  message: "Something went wrong while verifying this file",
                  file: null,
                  validation: {
                    isValid: false,
                    errors: ["Something went wrong while verifying this file"],
                  },
                } as VerificationResponse,
              };
            }
          })
        );

        const verificationStatePatch: Record<
          string,
          QuestionVerificationState
        > = {};
        const errorPatch: Record<string, QuestionErrorState> = {};
        const failedVerifications: Array<{
          key: string;
          question: LeanQuestion | Question;
          message: string;
        }> = [];

        verificationResults.forEach(({ key, question, response }) => {
          const firstError =
            response.validation?.errors?.[0] || response.message || "";

          verificationStatePatch[key] = {
            verified: Boolean(response.verified),
            message: response.message || "",
            file: response.file ?? null,
            validationErrors: response.validation?.errors ?? [],
          };

          if (!response.verified) {
            errorPatch[key] = {
              hasError: true,
              message: firstError,
            };

            failedVerifications.push({
              key,
              question,
              message: firstError,
            });
          }
        });

        setQuestionVerificationResults((prev) => ({
          ...prev,
          ...verificationStatePatch,
        }));

        if (failedVerifications.length > 0) {
          setQuestionErrors((prev) => ({
            ...prev,
            ...errorPatch,
          }));

          const firstFewFailures = failedVerifications
            .slice(0, 3)
            .map(
              ({ question, message }) =>
                `"${getQuestionLabel(question)}" (${message})`
            )
            .join(", ");

          if (failedVerifications.length <= 3) {
            setError(`Please fix: ${firstFewFailures}`);
          } else {
            const remainingCount = failedVerifications.length - 3;
            setError(
              `Please fix: ${firstFewFailures} and ${remainingCount} others.`
            );
          }

          return;
        }
      } finally {
        setIsRevalidating(false);
      }
    }

    submitAnswers({ isDraft: false, shouldDisplaySuccess: true });
  };

  return (
    <Stack id="question-section-list-div" sx={{ gap: "2rem" }}>
      {questionSections.map((section: LeanSection, idx) => {
        const { name, desc, questions } = section;
        const sectionNumber = getSectionNumber(section, idx);
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
                verificationResults={questionVerificationResults}
                setVerificationResult={handleSetVerificationResult}
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
              loading={Boolean(isSubmitting) || isRevalidating}
              disabled={Boolean(isSubmitting) || isRevalidating}
            >
              Save Draft
            </LoadingButton>
          )}

          <LoadingButton
            id="submit-submission-button"
            variant="contained"
            onClick={handleValidationAndSubmit}
            loading={Boolean(isSubmitting) || isRevalidating}
            disabled={Boolean(isSubmitting) || isRevalidating}
          >
            {isRevalidating
              ? "Verifying..."
              : isApplication
              ? "Apply"
              : isDraft
              ? "Submit"
              : "Update"}
          </LoadingButton>
        </Stack>
      )}
    </Stack>
  );
};

export default QuestionSectionsList;
