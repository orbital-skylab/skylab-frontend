import {
  AdministratorRole,
  AdviserRole,
  MentorRole,
  StudentRole,
} from "./roles";

export type User = UserMetadata & RoleMetadata;

export type LeanUser = Pick<
  User,
  "id" | "name" | "student" | "adviser" | "mentor" | "administrator"
>;

export type UserMetadata = {
  id: number;
  name: string;
  email: string;
  profilePicUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  personalSiteUrl?: string;
  selfIntro?: string;
};

export type RoleMetadata = {
  student?: StudentRole;
  adviser?: AdviserRole;
  mentor?: MentorRole;
  administrator?: AdministratorRole;
};
