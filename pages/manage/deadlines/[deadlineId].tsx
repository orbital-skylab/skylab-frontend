import { useState } from "react";
// Components
import GoBackButton from "@/components/buttons/GoBackButton";
import Body from "@/components/layout/Body";
import SnackbarAlert from "@/components/layout/SnackbarAlert";
import DeadlineDescriptionCard from "@/components/questions/DeadlineDescriptionCard";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import EditQuestionSectionsList from "@/components/questions/EditQuestionSectionsList";
import QuestionSectionsList from "@/components/questions/QuestionSectionsList";
// Hooks
import useFetch, { isError, isFetching } from "@/hooks/useFetch";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { useRouter } from "next/router";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useQuestionSections from "@/hooks/useQuestionSections";
import useAnswers from "@/hooks/useAnswers";
// Helpers
import {
  processSections,
  stripSections,
} from "@/components/questions/EditQuestionSectionsList/EditQuestionsList/EditQuestionsList.helpers";
import { PAGES } from "@/helpers/navigation";
// Types
import { GetDeadlineDetailsResponse } from "@/types/api";
import type { NextPage } from "next";
import { HTTP_METHOD } from "@/types/api";
import { ROLES } from "@/types/roles";

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
  const { sections, actions: questionSectionsActions } = useQuestionSections();
  const { setSections, addSection, clearSections } = questionSectionsActions;
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // For controlled inputs in preview mode
  const { answers, actions: answersActions } = useAnswers();
  const { clearAnswers, setEmptyAnswers } = answersActions;

  const { data: deadlineDetailsResponse, status: fetchDeadlineDetailsStatus } =
    useFetch<GetDeadlineDetailsResponse>({
      endpoint: `/deadlines/${deadlineId}/questions`,
      onFetch: (deadlineDetailsResponse) => {
        setDeadlineDescription(deadlineDetailsResponse.deadline.desc ?? "");
        if (
          deadlineDetailsResponse.sections &&
          deadlineDetailsResponse.sections.length
        ) {
          setSections(stripSections(deadlineDetailsResponse.sections));
        } else {
          addSection();
        }
      },
      enabled: !!deadlineId,
    });

  const saveQuestionSections = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/deadlines/${deadlineId}/questions`,
    requiresAuthorization: true,
  });

  const saveDeadlineDescription = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/deadlines/${deadlineId}`,
    requiresAuthorization: true,
  });

  const saveQuestionSectionsAndDescription = async () => {
    try {
      await Promise.all([
        saveQuestionSections.call({ sections: processSections(sections) }),
        saveDeadlineDescription.call({
          deadline: { desc: deadlineDescription },
        }),
      ]);
      setSuccess(
        `Successfully updated ${deadlineDetailsResponse?.deadline.name}'s description and questions!`
      );
    } catch (error) {
      setError(error);
    }
  };

  /** Helper functions */
  const handleTogglePreviewMode = () => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      clearAnswers();
    } else {
      setIsPreviewMode(true);
      setEmptyAnswers(sections, true);
    }
  };

  const resetQuestionSections = () => {
    if (
      !confirm("Are you sure you want to reset the form to its original state?")
    ) {
      return null;
    }

    if (
      deadlineDetailsResponse &&
      deadlineDetailsResponse.sections &&
      deadlineDetailsResponse.sections.length
    ) {
      setSections(deadlineDetailsResponse.sections);
    } else {
      clearSections();
      addSection();
    }
  };

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
              label: `Editing Deadline ${deadlineId} Details`,
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
          <EditQuestionSectionsList
            sections={sections}
            questionSectionsActions={questionSectionsActions}
            saveQuestionSectionsAndDescription={
              saveQuestionSectionsAndDescription
            }
            isSubmitting={isCalling(
              saveDeadlineDescription.status,
              saveQuestionSections.status
            )}
            resetQuestionSections={resetQuestionSections}
          />
        ) : (
          <QuestionSectionsList
            questionSections={sections}
            answers={answers}
            answersActions={answersActions}
            accessAnswersWithQuestionIndex
            // Dummy props as this is component is just for a preview here
            submitAnswers={(options) => {
              if (options && options.isDraft) {
                alert("Save the answers as a draft");
              } else {
                alert("Submitted the answers");
              }
            }}
            isSubmitting={false}
          />
        )}
      </Body>
    </>
  );
};
export default DeadlineQuestions;
