import { Section, LeanSection } from "@/types/deadlines";
import { Answer } from "@/types/submissions";
import useAnswers from "./useAnswers";

export type State = { answers: Record<Answer["questionId"], Answer["answer"]> };

export type Action = {
  type: ACTION_TYPE;
  payload?: {
    questionId?: number;
    answer?: string;
    answers?: Answer[];
    questionSections?: (Section | LeanSection)[];
    accessAnswersWithQuestionIndex?: boolean;
  };
};

export enum ACTION_TYPE {
  SET_ANSWERS,
  SET_ANSWER,
  SET_EMPTY_ANSWERS,
  CLEAR_ANSWERS,
}

export type UseAnswersActions = ReturnType<typeof useAnswers>["actions"];
