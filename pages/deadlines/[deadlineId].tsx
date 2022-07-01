import { ChangeEvent, useCallback, useState } from "react";
// Components
import GoBackButton from "@/components/buttons/GoBackButton";
import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import AddQuestionButton from "@/components/questions/AddQuestionButton";
import EditQuestionsList from "@/components/questions/EditQuestionsList";
import SnackbarAlert from "@/components/SnackbarAlert";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
// Hooks
import useFetch, { isError, isFetching } from "@/hooks/useFetch";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { useRouter } from "next/router";
// Types
import {
  Deadline,
  LeanQuestion,
  Option,
  Question,
  QUESTION_TYPE,
} from "@/types/deadlines";
import type { NextPage } from "next";
import QuestionsList from "@/components/questions/QuestionsList";

export type DeadlineDetailsResponse = {
  deadline: Deadline;
  questions: Question[];
};

const DeadlineQuestions: NextPage = () => {
  const router = useRouter();
  const { deadlineId } = router.query;
  const { snackbar, handleClose: handleCloseSnackbar } = useSnackbarAlert();
  const [deadlineDescription, setDeadlineDescription] = useState("");
  const [questions, setQuestions] = useState<LeanQuestion[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // For controlled inputs in preview mode
  const [answers, setAnswers] = useState<Record<number, Option>>({});

  /** Fetch deadline description and questions data */
  const { data: deadlineDetailsResponse, status: fetchDeadlineDetailsStatus } =
    useFetch<DeadlineDetailsResponse>({
      endpoint: `/deadlines/${deadlineId}/questions`,
      onFetch: (deadlineDetailsResponse) => {
        setDeadlineDescription(deadlineDetailsResponse.deadline.desc ?? "");
        if (deadlineDetailsResponse.questions.length) {
          setQuestions(deadlineDetailsResponse.questions);
        } else {
          addQuestion();
        }
      },
      enabled: !!deadlineId,
    });

  /** Helper functions */
  const handleDeadlineDescriptionChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setDeadlineDescription(e.target.value);
  };

  const handleTogglePreviewMode = () => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      setAnswers({});
    } else {
      setIsPreviewMode(true);
      // Answers are accessed via the index of the question
      const emptyAnswers: Record<number, Option> = {};
      questions.forEach((question, idx) => (emptyAnswers[idx] = ""));
      setAnswers(emptyAnswers);
    }
  };

  /** Function to add a new question */
  const addQuestion = () => {
    const newDefaultQuestion = {
      question: "",
      desc: "",
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      options: [""],
      isAnonymous: false,
    };

    setQuestions((questions) => [...questions, newDefaultQuestion]);
  };

  /** Function to set a question at a specific index.
   * This is so that each component only receives the setter they need */
  const generateSetQuestion = useCallback(
    (idx: number) => {
      const setQuestion = (newQuestion?: LeanQuestion) => {
        const newQuestions = [...questions];

        if (newQuestion) {
          newQuestions.splice(idx, 1, newQuestion);
        } else {
          // Delete the question
          newQuestions.splice(idx, 1);
        }
        setQuestions(newQuestions);
      };

      return setQuestion;
    },
    [questions]
  );

  /**
   * Function to set an answer for a specific question based on its idx.
   * This is so that each <QuestionCard/> component only receives the setter they need.
   */
  const generateSetAnswer = useCallback(
    (questionIdx: number) => {
      const setAnswer = (newAnswer: string) => {
        const newAnswers = { ...answers };
        newAnswers[questionIdx] = newAnswer;
        setAnswers(newAnswers);
      };

      return setAnswer;
    },
    [answers]
  );

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleCloseSnackbar} />
      <Body
        isLoading={isFetching(fetchDeadlineDetailsStatus)}
        isError={isError(fetchDeadlineDetailsStatus)}
      >
        <GoBackButton />
        <Card elevation={5} sx={{ marginBottom: "1rem" }}>
          <CardContent>
            <Stack direction="row" alignItems="center" marginBottom="0.5rem">
              <Typography variant="h6">
                {deadlineDetailsResponse?.deadline.name}
              </Typography>
              <FormControlLabel
                value={isPreviewMode}
                onClick={handleTogglePreviewMode}
                control={<Switch color="info" />}
                label="Preview Questions"
                labelPlacement="start"
                sx={{ marginLeft: "auto" }}
              />
            </Stack>

            {!isPreviewMode ? (
              <TextField
                size="small"
                rows={3}
                multiline
                fullWidth
                value={deadlineDescription}
                onChange={handleDeadlineDescriptionChange}
              />
            ) : (
              <Typography variant="body2">{deadlineDescription}</Typography>
            )}
          </CardContent>
        </Card>

        <NoDataWrapper
          noDataCondition={!questions.length}
          fallback={
            <>
              <NoneFound
                message="No questions found"
                actionPrompt={
                  <Button
                    size="small"
                    variant="contained"
                    onClick={addQuestion}
                  >
                    Add Your First Question
                  </Button>
                }
              />
            </>
          }
        >
          {!isPreviewMode ? (
            <>
              <EditQuestionsList
                questions={questions}
                generateSetQuestion={generateSetQuestion}
              />
              <AddQuestionButton addQuestion={addQuestion} />
            </>
          ) : (
            <QuestionsList
              questions={questions}
              answers={answers}
              generateSetAnswer={generateSetAnswer}
            />
          )}
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default DeadlineQuestions;
