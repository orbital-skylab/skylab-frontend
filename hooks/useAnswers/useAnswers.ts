import { LeanSection, Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import { useReducer } from "react";
import { reducer } from "./useAnswers.helpers";
import { ACTION_TYPE, State } from "./useAnswers.types";

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
    console.log(state.answers);
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
