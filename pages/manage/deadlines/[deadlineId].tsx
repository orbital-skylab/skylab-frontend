import { useCallback, useState } from "react";
// Components
import GoBackButton from "@/components/buttons/GoBackButton";
import Body from "@/components/layout/Body";
import AddQuestionButton from "@/components/questions/AddQuestionButton";
import EditQuestionsList from "@/components/questions/EditQuestionsList";
import SnackbarAlert from "@/components/SnackbarAlert";
import QuestionsList from "@/components/questions/QuestionsList";
import DeadlineDescriptionCard from "@/components/questions/DeadlineDescriptionCard";
import { Button, Stack } from "@mui/material";
// Hooks
import useFetch, { isError, isFetching } from "@/hooks/useFetch";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { useRouter } from "next/router";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
// Helpers
import { stripOptions } from "@/components/questions/EditQuestionsList/EditQuestionsList.helpers";
// Types
import { LeanQuestion, Option, QUESTION_TYPE } from "@/types/deadlines";
import { GetDeadlineDetailsResponse } from "@/types/api";
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";
import { ROLES } from "@/types/roles";
import AutoBreadcrumbs from "@/components/AutoBreadcrumbs";
import { PAGES } from "@/helpers/navigation";

const DeadlineQuestions: NextPage = () => {
  const router = useRouter();
  const { deadlineId } = router.query;
  const {
    snackbar,
    handleClose: handleCloseSnackbar,
    setSuccess,
    setError,
  } = useSnackbarAlert();
  const [deadlineDescription, setDeadlineDescription] = useState("");
  const [questions, setQuestions] = useState<LeanQuestion[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // For controlled inputs in preview mode
  const [answers, setAnswers] = useState<Record<number, Option>>({});

  const {
    data: deadlineDetailsResponse,
    status: fetchDeadlineDetailsStatus,
    refetch,
  } = useFetch<GetDeadlineDetailsResponse>({
    endpoint: `/deadlines/${deadlineId}/questions`,
    onFetch: (deadlineDetailsResponse) => {
      setDeadlineDescription(deadlineDetailsResponse.deadline.desc ?? "");
      if (deadlineDetailsResponse.questions.length) {
        setQuestions(deadlineDetailsResponse.questions);
      } else {
        addNewQuestion();
      }
    },
    enabled: !!deadlineId,
  });

  const saveQuestions = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/deadlines/${deadlineId}/questions`,
    requiresAuthorization: true,
  });

  const saveDeadlineDescription = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/deadlines/${deadlineId}`,
    requiresAuthorization: true,
  });

  const saveQuestionsAndDescription = async () => {
    try {
      await Promise.all([
        saveQuestions.call({ questions: stripOptions(questions) }),
        saveDeadlineDescription.call({
          deadline: { desc: deadlineDescription },
        }),
      ]);
      setSuccess(
        `Successfully updated ${deadlineDetailsResponse?.deadline.name}'s description and questions!`
      );
      refetch();
    } catch (error) {
      setError(error);
    }
  };

  /** Helper functions */
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

  const addNewQuestion = () => {
    const newDefaultQuestion = {
      question: "",
      desc: "",
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      options: [""],
      isAnonymous: false,
    };

    setQuestions((questions) => [...questions, newDefaultQuestion]);
  };

  const resetQuestions = () => {
    if (
      !deadlineDetailsResponse?.questions ||
      !confirm("Are you sure you want to reset the form to its original state?")
    ) {
      return null;
    }

    setQuestions(deadlineDetailsResponse.questions);
    addNewQuestion();
  };

  /**
   * Function to set a question at a specific index.
   * This is so that each component only receives the setter they need
   */
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
        authorizedRoles={[ROLES.ADMINISTRATORS]}
      >
        <AutoBreadcrumbs
          breadcrumbs={[
            {
              label: `Editing ${deadlineId}`,
              href: `${PAGES.MANAGE_DEADLINES}/${deadlineId}`,
            },
          ]}
          replaceLast
        />
        <GoBackButton />
        <DeadlineDescriptionCard
          isPreviewMode={isPreviewMode}
          handleTogglePreviewMode={handleTogglePreviewMode}
          deadlineName={deadlineDetailsResponse?.deadline.name}
          deadlineDescription={deadlineDescription}
          setDeadlineDescription={setDeadlineDescription}
        />
        {!isPreviewMode ? (
          <>
            <EditQuestionsList
              questions={questions}
              generateSetQuestion={generateSetQuestion}
            />
            <AddQuestionButton addQuestion={addNewQuestion} />
            <Stack direction="row" justifyContent="space-between" mt="2rem">
              <Button onClick={resetQuestions}>Reset</Button>
              <Button
                variant="contained"
                onClick={saveQuestionsAndDescription}
                disabled={isCalling(saveQuestions.status)}
              >
                Save
              </Button>
            </Stack>
          </>
        ) : (
          <QuestionsList
            questions={questions}
            answers={answers}
            generateSetAnswer={generateSetAnswer}
          />
        )}
      </Body>
    </>
  );
};
export default DeadlineQuestions;
