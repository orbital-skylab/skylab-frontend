import React, { useEffect, useState } from "react";
import QuestionSectionsList from "@/components/questions/QuestionSectionsList";
import useAnswers from "@/hooks/useAnswers";
import { Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";

const AnonymousQuestionSectionsList = ({
  questionSections,
  answersArray,
}: {
  questionSections: Section[];
  answersArray: Answer[];
}) => {
  const { answers, actions } = useAnswers();
  const [hasLoadedAnswers, setHasLoadedAnswers] = useState(false);

  useEffect(() => {
    if (!hasLoadedAnswers && answersArray) {
      actions.setAnswersFromArray(answersArray);
      setHasLoadedAnswers(true);
    }
  }, [actions, answersArray, hasLoadedAnswers]);

  if (!hasLoadedAnswers) {
    return null;
  }

  return (
    <QuestionSectionsList
      questionSections={questionSections}
      answers={answers}
      includeAnonymousQuestions
      isReadonly={true}
      answersActions={actions}
    />
  );
};

export default AnonymousQuestionSectionsList;
