import { isQuestion } from "@/helpers/types";
import { Action, ACTION_TYPE, State } from "./useAnswers.types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.SET_ANSWER: {
      const newState = { ...state };
      const { answers } = newState;

      if (!action.payload) {
        alert("An error has occurred while setting an answer");
        return state;
      }

      const { questionId, answer: newAnswer } = action.payload;

      if (
        questionId === undefined ||
        !newAnswer ||
        answers[questionId] === undefined
      ) {
        alert("An error has occurred while setting an answer");
        return state;
      }

      answers[questionId] = newAnswer;
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

      const newAnswers: State["answers"] = {};
      answers.forEach(
        ({ questionId, answer }) => (newAnswers[questionId] = answer)
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

      const answers: State["answers"] = {};

      questionSections.forEach((section, sectionIdx) => {
        section.questions.forEach((question, questionIdx) => {
          if (accessAnswersWithQuestionIndex) {
            const index = sectionIdx * questionSections.length + questionIdx;
            answers[index] = "";
          } else {
            if (!isQuestion(question)) {
              alert("An error has occurred while setting empty answers");
              return state;
            }
            answers[question.id] = "";
          }
        });
      });

      return { answers };
    }

    case ACTION_TYPE.CLEAR_ANSWERS: {
      return { answers: {} };
    }
  }
};
