import {
  ResultsFilter,
  VOTE_EVENT_STATUS,
  VoteEvent,
  VoterManagement,
} from "@/types/voteEvents";

export const DEFAULT_REGISTRATION_PERIOD = {
  registrationStartTime: "",
  registrationEndTime: "",
};

export const DEFAULT_RESULTS_FILTER: ResultsFilter = {
  areResultsPublished: false,
  displayLimit: 0,
  showRank: true,
  showVotes: true,
  showPoints: true,
  showPercentage: true,
  publicWeight: 1,
  studentWeight: 1,
  mentorWeight: 1,
  adviserWeight: 1,
  administratorWeight: 1,
};

export const checkIfRegistrationIsOpen = (
  voterManagement: VoterManagement
): boolean => {
  const { registrationStartTime, registrationEndTime } = voterManagement;

  if (registrationStartTime === "" || registrationEndTime === "") {
    return false;
  }

  const now = new Date();
  const startTime = new Date(registrationStartTime);
  const endTime = new Date(registrationEndTime);

  return now >= startTime && now <= endTime;
};

/**
 * Gets the status of a vote event
 * @param voteEvent The vote event to get the status of
 * @returns The status of the vote event
 */
export const getVoteEventStatus = (voteEvent: VoteEvent): VOTE_EVENT_STATUS => {
  const now = new Date();
  const startTime = new Date(voteEvent.startTime);
  const endTime = new Date(voteEvent.endTime);

  // If the vote event is missing voter management or vote config, it is incomplete
  if (!voteEvent.voterManagement || !voteEvent.voteConfig) {
    return VOTE_EVENT_STATUS.INCOMPLETE;
  }

  if (now < startTime) {
    return VOTE_EVENT_STATUS.UPCOMING;
  }

  if (now > endTime) {
    return VOTE_EVENT_STATUS.COMPLETED;
  }

  if (now >= startTime && now <= endTime) {
    return VOTE_EVENT_STATUS.IN_PROGRESS;
  }

  // This should never happen
  throw new Error("Vote event status could not be determined");
};
