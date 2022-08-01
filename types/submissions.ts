import { Deadline, Option, Section } from "./deadlines";
import { Project } from "./projects";
import { User } from "./users";

export type Answer = {
  questionId: number;
  answer: Option;
};

export type Submission = {
  id: number;
  deadline: Deadline;
  sections: Section[];
  isDraft: boolean;
  answers: Answer[];
  fromProject?: Project;
  fromUser?: User;
  toProject?: Project;
  toUser?: User;
  updatedAt: string;
};

/**
 * A submission that could possibly not exist
 * (i.e. submissionId does not exist)
 * Used in `SubmissionTable` to render submissions that have yet to be submitted by users
 */
export type PossibleSubmission = {
  // If the submission does not exist, these two fields do not exist
  id?: number;
  updatedAt?: string;
  fromProject?: Project;
  fromUser?: User;
  toProject?: Project;
  toUser?: User;
};

export enum STATUS {
  SUBMITTED,
  SUBMITTED_LATE,
  SAVED_DRAFT,
  NOT_YET_STARTED,
}

export enum SUBMISSION_STATUS {
  ALL = "All",
  UNSUBMITTED = "Unsubmitted",
  SUBMITTED = "Submitted",
  SUBMITTED_LATE = "Submitted_Late",
}
