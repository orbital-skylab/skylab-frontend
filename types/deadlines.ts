import { Cohort } from "./cohorts";

export enum DEADLINE_TYPE {
  MILESTONE = "Milestone",
  EVALUATION = "Evaluation",
  SURVEY = "Survey",
}

export type Deadline = {
  id: number;
  cohortYear: Cohort["academicYear"];
  name: string;
  desc?: string;
  dueBy: string;
  type: DEADLINE_TYPE;
  createdAt: string;
  updatedAt: string;
};

export type Section = {
  id: string;
  deadlineId: number;
  sectionNumber: number;
  name: string;
  desc?: string;
  questions: Question[];
};

export type LeanSection = Omit<
  Section,
  "id" | "deadlineId" | "sectionNumber" | "questions"
> & { questions: LeanQuestion[] };

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
  sectionId: number;
  deadlineId: number;
  questionNumber: number;
  question: string;
  desc?: string;
  type: QUESTION_TYPE;
  options?: Option[];
  isAnonymous?: boolean;
};

export type LeanQuestion = Omit<
  Question,
  "id" | "questionNumber" | "deadlineId" | "sectionId"
>;

export type Option = string;
