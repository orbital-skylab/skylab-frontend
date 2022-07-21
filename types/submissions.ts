import { Deadline, Option, Section } from "./deadlines";
import { Project } from "./projects";
import { User } from "./users";

export type Answer = {
  questionId: number;
  answer: Option;
};

export type Submission = {
  submissionId: number;
  deadline: Deadline;
  sections: Section[];
  isDraft: boolean;
  answers: Answer[];
  fromProject?: Project;
  fromUser?: User;
  toProject?: Project;
  toUser?: User;
};
