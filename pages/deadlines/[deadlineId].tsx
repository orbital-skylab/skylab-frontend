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
  Question,
  QUESTION_TYPE,
} from "@/types/deadlines";
import type { NextPage } from "next";

export type DeadlineDetailsResponse = {
  deadline: Deadline;
  questions: Question[];
};

const DeadlineQuestions: NextPage = () => {
  const router = useRouter();
  const { deadlineId } = router.query;
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setError,
  } = useSnackbarAlert();
  const [deadlineDescription, setDeadlineDescription] = useState("");
  const [questions, setQuestions] = useState<LeanQuestion[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { data: deadlineDetailsResponse, status: fetchDeadlineDetailsStatus } =
    useFetch<DeadlineDetailsResponse>({
      endpoint: `/deadlines/${deadlineId}/questions`,
      onFetch: (deadlineDetailsResponse) => {
        setDeadlineDescription(deadlineDetailsResponse.deadline.desc ?? "");
        setQuestions(deadlineDetailsResponse.questions);
      },
      enabled: !!deadlineId,
    });

  const handleDeadlineDescriptionChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setDeadlineDescription(e.target.value);
  };

  const handleTogglePreviewMode = () => {
    setIsPreviewMode((isPreviewMode) => !isPreviewMode);
  };

  /** Function to add a new default question */
  const addQuestion = () => {
    if (!deadlineDetailsResponse) {
      setError("Deadline Details Not Found");
      return;
    }

    const newDefaultQuestion = {
      deadlineId: deadlineDetailsResponse?.deadline.id,
      question: "",
      desc: "",
      type: QUESTION_TYPE.SHORT_ANSWER,
      options: [""],
      isAnonymous: false,
    };

    setQuestions((questions) => [...questions, newDefaultQuestion]);
  };

  /** Function to set a question at a specific index so that each component only receives the setter they need */
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
              {questions.length ? (
                <FormControlLabel
                  value={isPreviewMode}
                  onClick={handleTogglePreviewMode}
                  control={<Switch color="info" />}
                  label="Preview Questions"
                  labelPlacement="start"
                  sx={{ marginLeft: "auto" }}
                />
              ) : null}
            </Stack>

            <TextField
              size="small"
              rows={3}
              multiline
              fullWidth
              value={deadlineDescription}
              onChange={handleDeadlineDescriptionChange}
            />
          </CardContent>
        </Card>

        <NoDataWrapper
          noDataCondition={!questions.length}
          fallback={
            <NoneFound
              message="No questions found"
              actionPrompt={
                <Button size="small" variant="contained" onClick={addQuestion}>
                  Add Your First Question
                </Button>
              }
            />
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
          ) : null}
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default DeadlineQuestions;
