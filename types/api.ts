import { Adviser } from "./advisers";
import { Announcement, AnnouncementWithCommentThreads } from "./announcements";
import { Cohort } from "./cohorts";
import { Deadline, DeadlineDeliverable, Section } from "./deadlines";
import { Mentor } from "./mentors";
import { LeanProject, Project } from "./projects";
import { EvaluationRelation } from "./relations";
import {
  AdministratorRole,
  AdviserRole,
  MentorRole,
  StudentRole,
} from "./roles";
import { Answer, PossibleSubmission, Submission } from "./submissions";
import { LeanUser, User, UserMetadata } from "./users";
import { ExternalVoter, VoteEvent, VoterManagement } from "./voteEvents";

export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum CONTENT_TYPE {
  JSON = "application/json",
}

/**
 * The type of query params.
 */
export type QueryParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/**
 * Users Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Users-Endpoints
 */
export type GetUserResponse = {
  user: UserMetadata;
};

export type GetUsersResponse = {
  users: User[];
};

export type GetLeanUsersResponse = {
  users: LeanUser[];
};

/**
 * Combined Roles Endpoints:
 */
export type CreateRoleResponse =
  | CreateStudentResponse
  | CreateAdviserResponse
  | CreateMentorResponse
  | CreateAdministratorResponse;

export type EditRoleResponse =
  | EditStudentResponse
  | EditAdviserResponse
  | EditMentorResponse
  | EditAdministratorResponse;

export type GetStaffsResponse = GetAdvisersResponse | GetMentorsResponse;

/**
 * Students Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Students-Endpoints
 */
export type CreateStudentResponse = {
  student: StudentRole;
};

export type EditStudentResponse = {
  student: StudentRole;
};

/**
 * Advisers Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Advisers-Endpoints
 */
export type CreateAdviserResponse = {
  adviser: AdviserRole;
};

export type EditAdviserResponse = {
  adviser: AdviserRole;
};

export type GetAdvisersResponse = {
  advisers: Adviser[];
};

/**
 * Mentors Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Mentors-Endpoints
 */
export type CreateMentorResponse = {
  mentor: MentorRole;
};

export type EditMentorResponse = {
  mentor: MentorRole;
};

export type GetMentorsResponse = {
  mentors: Mentor[];
};

/**
 * Administrators Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Administrators-Endpoints
 */
export type CreateAdministratorResponse = {
  administrator: AdministratorRole;
};

export type EditAdministratorResponse = {
  administrator: AdministratorRole;
};

/**
 * Projects Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Projects-Endpoints
 */
export type GetProjectResponse = {
  project: Project;
};

export type GetProjectsResponse = {
  projects: Project[];
};

export type GetLeanProjectsResponse = {
  projects: LeanProject[];
};

export type CreateProjectResponse = {
  project: Project;
};

/**
 * Cohorts Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Cohorts-Endpoints
 */
export type GetCohortsResponse = {
  cohorts: Cohort[];
};

export type GetCohortResponse = {
  cohort: Cohort;
};

export type AddCohortResponse = GetCohortResponse;

export type EditCohortResponse = GetCohortResponse;

/**
 * Deadlines Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Deadlines-Endpoints
 */
export type GetDeadlinesResponse = {
  deadlines: Deadline[];
};

export type GetDeadlineDetailsResponse = {
  deadline: Deadline;
  sections: Section[];
};

export type CreateDeadlineResponse = {
  deadline: Deadline;
};

export type EditDeadlineResponse = {
  deadline: Deadline;
};

/**
 * Submissions Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Submissions-Endpoints
 */
export type CreateSubmissionResponse = { submission: Submission };

export type GetSubmissionResponse = { submission: Submission };

export type GetSubmissionsAnonymousQuestions = {
  deadlines: {
    deadline: Deadline;
    sections: Section[];
    answers: Answer[][];
  }[];
};

export type EditSubmissionResponse = { submission: Submission };

/**
 * Dashbard Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Dashboard-Endpoints
 * - These endpoints are ONLY used on the dashboard.
 * - There may be other endpoints used in the dashboard and elsewhere and are hence not dashboard-specific.
 */
/** Student Dashboard Endpoints */
export type GetStudentDeadlinesResponse = {
  deadlines: DeadlineDeliverable[];
};

export type GetStudentPeerMilestonesResponse = {
  deadlines: {
    deadline: Deadline;
    submissions: PossibleSubmission[];
  }[];
};

export type GetStudentPeerEvaluationAndFeedbackResponse = {
  deadlines: {
    deadline: Deadline;
    submissions: PossibleSubmission[];
  }[];
};

/** Adviser Dashboard Endpoints */
export type GetAdviserDeadlinesResponse = {
  deadlines: DeadlineDeliverable[];
};

export type GetAdviserTeamSubmissionsResponse = {
  deadlines: {
    deadline: Deadline;
    submissions: PossibleSubmission[];
  }[];
};

/** Mentor Dashboard Endpoints */
export type GetMentorTeamSubmissionsResponse = {
  deadlines: {
    deadline: Deadline;
    submissions: PossibleSubmission[];
  }[];
};

/** Administrator Dashboard Endpoints */
export type GetAdministratorAllTeamMilestoneSubmissionsResponse = {
  submissions: PossibleSubmission[];
};

/**
 * Evaluation Relations Endpoints:
 * https://github.om/orbital-skylab/skylab-backend/wiki/Evaluation-Relationships-Endpoints
 */
export type CreateRelationResponse = {
  relation: EvaluationRelation;
};

export type GetRelationsResponse = {
  relations: EvaluationRelation[];
};

export type EditRelationResponse = {
  relation: EvaluationRelation;
};

export type DeleteProjectRelationsResponse = {
  relations: {
    count: number;
  };
};

/**
 * Announcements Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Announcement-Endpoints
 */
export type GetAnnouncementsResponse = {
  announcements: Announcement[];
};

export type GetAnnouncementWithCommentThreadsResponse = {
  announcement: AnnouncementWithCommentThreads;
};

export type CreateAnnouncementResponse = {
  announcement: Announcement;
};

export type EditAnnouncementResponse = {
  announcement: Announcement;
};

export type GetAnnouncementReadPercentageResponse = {
  readPercentage: {
    totalReadCount: number;
    totalUserCount: number;
    percentage: number;
  };
};

/**
 * Voting Endpoints
 */
export type GetVoteEventResponse = {
  voteEvent: VoteEvent;
};

export type GetVoteEventsResponse = {
  voteEvents: VoteEvent[];
};

export type CreateVoteEventResponse = {
  voteEvent: VoteEvent;
};

export type EditVoteEventResponse = {
  voteEvent: VoteEvent;
};

export type EditVoterManagementResponse = {
  voterManagement: VoterManagement;
};

export type GetExternalVotersResponse = {
  externalVoters: ExternalVoter[];
};

export type CreateExternalVoterResponse = {
  externalVoter: ExternalVoter;
};

export type GetInternalVotersResponse = {
  internalVoters: User[];
};

export type CreateInternalVoterResponse = {
  internalVoter: User;
};

/**
 * Error
 */
export type Error = { message: string };
