import { Adviser } from "./advisers";
import { Deadline, DeadlineInstance, Question } from "./deadlines";
import { Mentor } from "./mentors";
import { LeanProject, Project } from "./projects";
import {
  AdministratorRole,
  AdviserRole,
  MentorRole,
  StudentRole,
} from "./roles";
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

// TODO: Fix Jira Ticket 117
export type CreateUserResponse = unknown;

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
 * Deadlines Endpoints;
 * https://github.com/orbital-skylab/skylab-backend/wiki/Deadlines-Endpoints
 */
export type GetDeadlinesResponse = {
  deadlines: Deadline[];
};

export type GetDeadlineDetailsResponse = {
  deadline: Deadline;
  questions: Question[];
};

export type CreateDeadlineResponse = {
  deadline: Deadline;
};

/**
 * Dashbard Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Dashboard-Endpoints
 */

export type GetStudentDeadlines = {
  deadlines: DeadlineInstance[];
};

export type GetStudentPeerMilestones = {
  deadlines: {
    deadline: Omit<Deadline, "cohortYear" | "desc">;
    submissions: {
      submissionId: number;
      fromProject: {
        id: number; // project ID
        name: string;
      };
      updatedAt: string;
    }[];
  }[];
};

export type GetStudentPeerEvaluationAndFeedback = {
  deadlines: {
    deadline: Omit<Deadline, "cohortYear" | "desc">;
    submissions: {
      submissionId: number;
      // Only applicable for deadline type 'Evaluation' and 'Feedback'
      fromProject?: {
        id: number; // project ID
        name: string;
      };
      // Only applicable for deadline type 'Evaluation'
      fromUser?: {
        id: number; // user ID
        name: string;
      };
      updatedAt: string;
    }[];
  }[];
};

/**
 * Error
 */
export type Error = { message: string };
