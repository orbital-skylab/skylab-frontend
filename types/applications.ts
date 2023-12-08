import { LEVELS_OF_ACHIEVEMENT } from "./projects";

export type Application = {
  submissionId: number;
  teamName: string;
  achievement: LEVELS_OF_ACHIEVEMENT;
  status: APPLICATION_STATUS;
};

export enum APPLICATION_STATUS {
  UNPROCESSED = "Unprocessed",
  REJECTED = "Rejected",
  APPROVED = "Approved",
}

export enum APPLICATION_STATUS_WITH_ALL {
  UNPROCESSED = "Unprocessed",
  REJECTED = "Rejected",
  APPROVED = "Approved",
  ALL = "All",
}
