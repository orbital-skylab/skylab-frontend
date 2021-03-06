import { isQuestion } from "@/helpers/types";
import { LeanSection, Section } from "@/types/deadlines";
import { Action, ACTION_TYPE, State } from "./useAnswers.types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.SET_ANSWER: {
      const newState = { answers: new Map(state.answers) };
      const { answers } = newState;

      if (!action.payload) {
        alert("An error has occurred while setting an answer");
        return state;
      }

      const { questionId, answer: newAnswer } = action.payload;

      if (
        questionId === undefined ||
        newAnswer === undefined ||
        !answers.has(questionId)
      ) {
        alert("An error has occurred while setting an answer");
        return state;
      }

      answers.set(questionId, newAnswer);
      return newState;
    }

    case ACTION_TYPE.SET_ANSWERS: {
      if (!action.payload) {
        alert("An error has occurred while setting answers");
        return state;
      }

      const { answers } = action.payload;

      if (!answers) {
        alert("An error has occurred while setting answers");
        return state;
      }

      const newAnswers: State["answers"] = new Map();
      answers.forEach(({ questionId, answer }) =>
        newAnswers.set(questionId, answer)
      );
      return { answers: newAnswers };
    }

    case ACTION_TYPE.SET_EMPTY_ANSWERS: {
      if (!action.payload) {
        alert("An error has occurred while setting empty answers");
        return state;
      }

      const { questionSections, accessAnswersWithQuestionIndex } =
        action.payload;

      if (!questionSections) {
        alert("An error has occurred while setting empty answers");
        return state;
      }

      const answers: State["answers"] = new Map();

      questionSections.forEach((section, sectionIdx) => {
        const sectionIndexOffset = generateIndexOffset(
          questionSections,
          sectionIdx
        );
        section.questions.forEach((question, questionIdx) => {
          if (accessAnswersWithQuestionIndex) {
            const index = sectionIndexOffset + questionIdx;
            answers.set(index, "");
          } else {
            if (!isQuestion(question)) {
              alert("An error has occurred while setting empty answers");
              return state;
            }
            answers.set(question.id, "");
          }
        });
      });

      return { answers };
    }

    case ACTION_TYPE.CLEAR_ANSWERS: {
      return { answers: new Map() };
    }
  }
};

/**
 * Generates the index offset for the current section
 * (AKA number of questions across all sections BEFORE the current section specified by the sectionIdx)
 * @param questionSections
 * @param {number} sectionIdx The index of the current section
 * @returns {number} indexOffset
 */
export const generateIndexOffset = (
  questionSections: (LeanSection | Section)[],
  sectionIdx: number
): number => {
  return questionSections
    .slice(0, sectionIdx)
    .map((section) => section.questions.length)
    .reduce((a, b) => a + b, 0);
};
