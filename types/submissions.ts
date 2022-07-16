import { Option } from "./deadlines";

export type Answer = {
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
};
