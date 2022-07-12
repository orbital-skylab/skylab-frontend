import { LeanQuestion, LeanSection } from "@/types/deadlines";
import { useReducer } from "react";
import { reducer } from "./useQuestionSections.helpers";
import { ACTION_TYPE, State } from "./useQuestionSections.types";

const useSections = () => {
  const initialState: State = { sections: [] };

  const [state, dispatch] = useReducer(reducer, initialState);

  const setSectionDetails = (
    sectionIdx: number,
    {
      name,
      desc,
    }: {
      name?: string;
      desc?: string;
    }
  ) => {
    dispatch({
      type: ACTION_TYPE.SET_SECTION_DETAILS,
      payload: { sectionIdx, name, desc },
    });
  };

  const addQuestion = (sectionIdx: number) => {
    dispatch({ type: ACTION_TYPE.ADD_QUESTION, payload: { sectionIdx } });
  };

  /**
   * Generates the question setter function with 2 nested callbacks:
   * 1. One for currying the sectionIdx
   * 2. One for currying the questionIdx
   * This is to ensure that each question component is only able to modify its own question
   */
  const generateSetQuestionGenerator = (sectionIdx: number) => {
    const generateSetAnswer =
      (questionIdx: number) => (question?: LeanQuestion) => {
        if (question) {
          dispatch({
            type: ACTION_TYPE.SET_QUESTION,
            payload: { sectionIdx, questionIdx, question },
          });
        } else {
          dispatch({
            type: ACTION_TYPE.DELETE_QUESTION,
            payload: { sectionIdx, questionIdx },
          });
        }
      };
    return generateSetAnswer;
  };

  const addSection = () => {
    dispatch({ type: ACTION_TYPE.ADD_SECTION });
  };

  const setSections = (sections: LeanSection[]) => {
    dispatch({ type: ACTION_TYPE.SET_SECTIONS, payload: { sections } });
  };

  const generateDeleteSection = (sectionIdx: number) => {
    const deleteSection = () => {
      dispatch({ type: ACTION_TYPE.DELETE_SECTION, payload: { sectionIdx } });
    };
    return deleteSection;
  };

  const clearSections = () => {
    dispatch({ type: ACTION_TYPE.CLEAR_SECTIONS });
  };

  const actions = {
    setSectionDetails,
    addQuestion,
    generateSetQuestionGenerator,
    addSection,
    setSections,
    generateDeleteSection,
    clearSections,
  };

  return {
    ...state,
    dispatch,
    actions,
  };
};

export default useSections;
