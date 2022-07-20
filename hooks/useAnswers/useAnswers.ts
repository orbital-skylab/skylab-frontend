import { LeanSection, Section } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import { useReducer } from "react";
import { reducer } from "./useAnswers.helpers";
import { ACTION_TYPE, State } from "./useAnswers.types";

const useAnswers = () => {
  const initialState: State = { answers: new Map() };

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

  /**
   * This function converts answers from
   * 1. An array of Answer (as fetched from the database) to
   * 2. An ES6 Map where the key is the `questionId` and the value is the `answer` as stored in `useAnswers`
   * And sets the Map as the state
   * @param {Answer[]} answers
   */
  const setAnswersFromArray = (answers: Answer[]) => {
    dispatch({ type: ACTION_TYPE.SET_ANSWERS, payload: { answers } });
  };

  /**
   * This function retrieves the answers stored in `useAnswers` and converts it into an array of Answer
   */
  const getAnswersAsArray = () => {
    return Array.from(state.answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
  };

  const actions = {
    generateSetAnswer,
    setEmptyAnswers,
    clearAnswers,
    setAnswersFromArray,
  };

  return { ...state, dispatch, actions, getAnswersAsArray };
};

export default useAnswers;
