import { Project } from "@/types/projects";
import { User } from "@/types/users";

export enum LIST_TYPES {
  INTERNAL_VOTERS = "Internal Voters",
  EXTERNAL_VOTERS = "External Voters",
}

export enum VOTE_EVENT_TABS {
  GENERAL_SETTINGS = "General Settings",
  VOTER_MANAGEMENT = "Voter Management",
  CANDIDATES = "Candidates",
  VOTE_CONFIG = "Vote Config",
  RESULTS = "Results",
}

export enum DISPLAY_TYPES {
  NONE = "None",
  TABLE = "Table",
  GALLERY = "Gallery",
}

export enum VOTE_EVENT_STATUS {
  INCOMPLETE = "Incomplete",
  UPCOMING = "Upcoming",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export type VoteEvent = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  voterManagement?: VoterManagement;
  voteConfig?: VoteConfig;
  resultsFilter: ResultsFilter;
};

export type VoterManagement = {
  hasInternalList: boolean;
  hasExternalList: boolean;
  registrationStartTime: string;
  registrationEndTime: string;
};

export type VoteConfig = {
  maxVotes: number;
  minVotes: number;
  isRandomOrder: boolean;
  instructions: string;
  displayType: DISPLAY_TYPES;
};

export type ResultsFilter = {
  displayLimit: number;
  showRank: boolean;
  showVotes: boolean;
  showPoints: boolean;
  showPercentage: boolean;
  areResultsPublished: boolean;
  studentWeight: number;
  adviserWeight: number;
  mentorWeight: number;
  administratorWeight: number;
  publicWeight: number;
};

export type ExternalVoter = {
  id: string;
  voteEventId: number;
};

export type Vote = {
  id: number;
  voteEventId: number;
  projectId: number;
  userId: number | null;
  externalVoterId: string | null;
  internalVoter: User | null;
  project: Project;
};

export type VoteEventResult = {
  rank: number | null;
  project: Project;
  votes: number | null;
  points: number | null;
  percentage: number | null;
};
