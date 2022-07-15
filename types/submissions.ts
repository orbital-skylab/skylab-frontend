import { Option } from "./deadlines";

type Answer = {
  questionId: number;
  answer: Option;
};

export type Submission = {
  submissionId: number;
  deadlineId: number;
  isDraft: boolean;
  answers: Answer[];
  fromProjectId?: number;
  fromUserId?: number;
  toProjectId?: number;
  toUserId?: number;
  updatedAt: string;
};

export enum STATUS {
  SUBMITTED,
  SUBMITTED_LATE,
  SAVED_DRAFT,
  NOT_YET_STARTED,
}
