import { Project } from "./projects";
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

export type CreateUserResponse = User;

/**
 * Projects Endpoints:
 * https://github.com/orbital-skylab/skylab-backend/wiki/Projects-Endpoints
 */
export type GetProjectResponse = {
  project: Project;
};
