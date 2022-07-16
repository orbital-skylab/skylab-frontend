import { LeanSection, LeanQuestion } from "@/types/deadlines";
import useSections from "./useQuestionSections";

export type State = {
  sections: LeanSection[];
};

export type Action = {
  type: ACTION_TYPE;
  payload?: {
    sectionIdx?: number;
    questionIdx?: number;
    question?: LeanQuestion;
    sections?: LeanSection[];
    name?: string;
    desc?: string;
  };
};

export enum ACTION_TYPE {
  SET_SECTION_DETAILS,
  ADD_QUESTION,
  SET_QUESTION,
  DELETE_QUESTION,
  ADD_SECTION,
  SET_SECTIONS,
  DELETE_SECTION,
  CLEAR_SECTIONS,
}

export type UseSectionsActions = ReturnType<typeof useSections>["actions"];
