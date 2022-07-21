import { Adviser } from "./advisers";
import { Deadline, DeadlineDeliverable, Section } from "./deadlines";
import { EvaluationGroup } from "./groups";
import { Mentor } from "./mentors";
import { LeanProject, Project } from "./projects";
import {
  AdministratorRole,
  AdviserRole,
  MentorRole,
  StudentRole,
} from "./roles";
import { PossibleSubmission, Submission } from "./submissions";
import { User, UserMetadata } from "./users";

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
 * Users Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Users-Endpoints
 */
export type GetUserResponse = {
  user: UserMetadata;
};

export type GetUsersResponse = {
  users: User[];
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

/**
 * Submissions Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Submissions-Endpoints
 */
export type CreateSubmissionResponse = Submission;

export type GetSubmissionResponse = { submission: Submission };

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

/**
 * Groups Endpoints:
 */
export type CreateGroupResponse = {
  group: EvaluationGroup;
};

export type EditGroupResponse = {
  group: EvaluationGroup;
};

/**
 * Error
 */
export type Error = { message: string };
