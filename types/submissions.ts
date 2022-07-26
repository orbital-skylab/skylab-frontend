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
  // Only applicable for:
  // 1. Student dashboard is fetching Milestones, Evaluations, and Feedbacks from peer teams
  fromProject?: {
    id: number;
    name: string;
  };
  // Only applicable for:
  // 1. Student dashboard is fetching Evaluations from adviser
  fromUser?: {
    id: number;
    name: string;
  };
  // Only applicable for:
  // 1. Student dashboard
  toProject?: {
    id: number;
    name: string;
  };
  // Only applicable for:
  toUser?: {
    id: number;
    name: string;
  };
};

export enum STATUS {
  SUBMITTED,
  SUBMITTED_LATE,
  SAVED_DRAFT,
  NOT_YET_STARTED,
}
