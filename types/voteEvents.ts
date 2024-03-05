export enum LIST_TYPES {
  INTERNAL_VOTERS = "Internal Voters",
  EXTERNAL_VOTERS = "External Voters",
}

export enum VOTE_EVENT_TABS {
  GENERAL_SETTINGS = "General Settings",
  VOTER_MANAGEMENT = "Voter Management",
}

export type VoteEvent = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  isRegistrationOpen: boolean;
  voterManagement: VoterManagement | null;
};

export type VoterManagement = {
  voteEventId: number;
  internalList: boolean;
  registration: boolean;
  internalCsvImport: boolean;
  externalList: boolean;
  generation: boolean;
  externalCsvImport: boolean;
};

export type ExternalVoter = {
  id: string;
  voteEventId: number;
};
