import { Option } from "./deadlines";

type SubmissionMetadata = {
  submitter: number;
  evaluatee?: number;
};

type Answer = {
  questionId: number;
  answer: Option;
};

export type Submission = {
  submission: SubmissionMetadata;
  answers: Answer[];
};
