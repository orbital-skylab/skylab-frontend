import { LeanQuestion, LeanSection, QUESTION_TYPE } from "@/types/deadlines";
import { Action, ACTION_TYPE, State } from "./useQuestionSections.types";

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_SECTION_DETAILS: {
      const newState = { ...state };
      const { sections } = newState;

      if (!action.payload) {
        alert("An error has occurred while setting a section details");
        return state;
      }

      const { sectionIdx, name, desc } = action.payload;

      if (sectionIdx === undefined || (!name && !desc)) {
        alert("An error has occurred while setting a section details");
        return state;
      }

      if (name) {
        sections[sectionIdx].name = name;
      }

      if (desc) {
        sections[sectionIdx].desc = desc;
      }

      return newState;
    }

    case ACTION_TYPE.ADD_QUESTION: {
      const newState = { ...state };
      const { sections } = newState;

      if (!action.payload) {
        alert("An error has occurred while adding a question");
        return state;
      }

      const { sectionIdx } = action.payload;

      if (sectionIdx === undefined) {
        alert("An error has occurred while adding a question");
        return state;
      }

      sections[sectionIdx].questions.push(newDefaultQuestion);

      return newState;
    }

    case ACTION_TYPE.SET_QUESTION: {
      const newState = { ...state };
      const { sections } = newState;

      if (!action.payload) {
        alert("An error has occurred while setting a question");
        return state;
      }

      const { sectionIdx, questionIdx, question: newQuestion } = action.payload;

      if (
        sectionIdx === undefined ||
        questionIdx === undefined ||
        !newQuestion ||
        sections.length <= sectionIdx ||
        sections[sectionIdx].questions.length <= questionIdx
      ) {
        alert("An error has occurred while setting a question");
        return state;
      }

      const questions = sections[sectionIdx].questions;

      questions.splice(questionIdx, 1, newQuestion);
      return newState;
    }

    case ACTION_TYPE.DELETE_QUESTION: {
      const newState = { ...state };
      const { sections } = newState;

      if (!action.payload) {
        alert("An error has occurred while deleting a question");
        return state;
      }

      const { sectionIdx, questionIdx } = action.payload;

      if (
        sectionIdx === undefined ||
        questionIdx === undefined ||
        sections.length <= sectionIdx ||
        sections[sectionIdx].questions.length <= questionIdx
      ) {
        alert("An error has occurred while deleting a question");
        return state;
      }

      const questions = sections[sectionIdx].questions;

      questions.splice(questionIdx, 1);
      return newState;
    }

    case ACTION_TYPE.ADD_SECTION: {
      const newState = { ...state };
      const { sections } = newState;

      sections.push(newDefaultSection);

      return newState;
    }

    case ACTION_TYPE.SET_SECTIONS: {
      if (!action.payload || !action.payload.sections) {
        alert("An error has occurred while setting the deadline sections");
        return state;
      }

      return { sections: action.payload.sections };
    }

    case ACTION_TYPE.DELETE_SECTION: {
      const newState = { ...state };
      const { sections } = newState;

      if (!action.payload) {
        alert("An error has occurred while deleting a section");
        return state;
      }

      const { sectionIdx } = action.payload;

      if (sectionIdx === undefined || sections.length <= sectionIdx) {
        alert("An error has occurred while deleting a question");
        return state;
      }

      if (sections[sectionIdx].questions.length) {
        alert("You cannot delete sections that still have questions");
        return state;
      }

      sections.splice(sectionIdx, 1);
      return newState;
    }

    case ACTION_TYPE.CLEAR_SECTIONS: {
      return { sections: [] };
    }
  }
};

const newDefaultQuestion: LeanQuestion = {
  question: "",
  desc: "",
  type: QUESTION_TYPE.MULTIPLE_CHOICE,
  options: [""],
  isAnonymous: false,
};

const newDefaultSection: LeanSection = {
  name: "",
  desc: "",
  questions: [newDefaultQuestion],
};
