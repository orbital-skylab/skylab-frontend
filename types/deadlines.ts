import { Cohort } from "./cohorts";

export enum DEADLINE_TYPE {
  MILESTONE = "Milestone",
  EVALUATION = "Evaluation",
  SURVEY = "Survey",
  OTHER = "Other",
}

export type Deadline = {
  id: number;
  cohortYear: Cohort["academicYear"];
  name: string;
  desc?: string;
  dueBy: string;
  type: DEADLINE_TYPE;
};

export enum QUESTION_TYPE {
  SHORT_ANSWER = "ShortAnswer",
  PARAGRAPH = "Paragraph",
  MULTIPLE_CHOICE = "MultipleChoice",
  CHECKBOXES = "Checkboxes",
  DROPDOWN = "Dropdown",
  URL = "Url",
  DATE = "Date",
  TIME = "Time",
}

export type Question = {
  id: number;
  deadlineId: number;
  questionNumber: number;
  question: string;
  desc: string;
  type: QUESTION_TYPE;
  options?: Option[];
  isAnonymous?: boolean;
};

export type LeanQuestion = Omit<
  Question,
  "id" | "questionNumber" | "deadlineId"
>;

export type Option = string;

/**
 * The deliverables of a Deadline
 * Eg.
 * - 'Milestone 2 Evaluation' is a deadline
 *   - This is what the administrator sets on the `/manage/deadlines` page
 * - 'Milestone 2 Evaluation for Team 2 by Team 1' is a deadline deliverable
 *   - This is what users see on the `/dashboard/<role>` page when viewing upcoming deadlines
 */
export type DeadlineDeliverable = {
  deadline: Omit<Deadline, "cohortYear" | "desc">;
  // Only applicable for deadline type 'Evaluation' and 'Feedback'
  toProject?: {
    id: number; // project ID
    name: string;
  };
  // Only applicable for deadline type 'Feedback' where user is the adviser
  toUser?: {
    id: number; // user ID
    name: string;
  };
  // Only exists if a draft OR submission has been created
  submission?: {
    id: number; // submission ID
    updatedAt: string;
  };
};
