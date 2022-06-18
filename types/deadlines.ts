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
};

export type Option = string;
