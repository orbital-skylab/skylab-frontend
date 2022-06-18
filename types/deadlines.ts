import { Cohort } from "./cohorts";

export enum DeadlineType {
  Milestone = "Milestone",
  Evaluation = "Evaluation",
  Survey = "Survey",
  Other = "Other",
}

export type Deadline = {
  id: number;
  cohortYear: Cohort["academicYear"];
  name: string;
  dueBy: string;
  type: DeadlineType;
};

export enum QuestionType {
  ShortAnswer = "ShortAnswer",
  Paragraph = "Paragraph",
  MultipleChoice = "MultipleChoice",
  Checkboxes = "Checkboxes",
  Dropdown = "Dropdown",
  Url = "Url",
  Date = "Date",
  Time = "Time",
}

export type Question = {
  id: number;
  deadlineId: number;
  questionNumber: number;
  question: string;
  desc: string;
  type: QuestionType;
  options?: Option[];
};

export type Option = string;
