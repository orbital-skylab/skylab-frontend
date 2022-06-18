import { Option } from "./deadlines";

type SubmissionMetaData = {
  submitter: number;
  evaluatee?: number;
};

type Answer = {
  questionId: number;
  answer: Option;
};

export type Submission = {
  submission: SubmissionMetaData;
  answers: Answer[];
};
