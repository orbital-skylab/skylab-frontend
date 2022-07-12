import { isQuestion } from "@/helpers/types";
import { LeanSection, Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import { useReducer } from "react";

type State = { answers: Record<Answer["questionId"], Answer["answer"]> };

type Action = {
  type: ACTION_TYPE;
  payload?: {
    questionId?: number;
    answer?: string;
    answers?: Answer[];
    questionSections?: (Section | LeanSection)[];
    accessAnswersWithQuestionIndex?: boolean;
  };
};

enum ACTION_TYPE {
  SET_ANSWERS,
  SET_ANSWER,
  SET_EMPTY_ANSWERS,
  CLEAR_ANSWERS,
}

const reducer = (state: State, action: Action) => {
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

const useAnswers = () => {
  const initialState: State = { answers: {} };

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Generates the question setter function with 2 nested callbacks:
   * 1. One for currying the sectionIdx
   * 2. One for currying the questionIdx
   * This is to ensure that each question component is only able to modify its own question
   */
  const generateSetAnswer = (questionId: number) => {
    const setAnswer = (answer: Answer["answer"]) => {
      dispatch({
        type: ACTION_TYPE.SET_ANSWER,
        payload: { questionId, answer },
      });
    };

    return setAnswer;
  };

  const setEmptyAnswers = (
    questionSections: (Section | LeanSection)[],
    accessAnswersWithQuestionIndex = false
  ) => {
    dispatch({
      type: ACTION_TYPE.SET_EMPTY_ANSWERS,
      payload: { questionSections, accessAnswersWithQuestionIndex },
    });
  };

  const clearAnswers = () => {
    dispatch({ type: ACTION_TYPE.CLEAR_ANSWERS });
  };

  const actions = {
    generateSetAnswer,
    setEmptyAnswers,
    clearAnswers,
  };

  return { ...state, dispatch, actions };
};

export default useAnswers;

export type UseAnswersActions = ReturnType<typeof useAnswers>["actions"];
