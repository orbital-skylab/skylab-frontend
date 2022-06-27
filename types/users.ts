import {
  AdministratorRole,
  AdviserRole,
  FacilitatorRole,
  MentorRole,
  StudentRole,
} from "./roles";

export type User = UserMetadata & RoleMetadata;

export type UserMetadata = {
  id: number;
  name: string;
  email: string;
  profilePicUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  personalSiteUrl?: string;
  selfIntro?: string;
  submitterId?: string;
};

export type RoleMetadata = {
  student?: StudentRole;
  adviser?: AdviserRole;
  mentor?: MentorRole;
  administrator?: AdministratorRole;
  facilitator?: FacilitatorRole;
};

export type GetUserResponse = {
  user: UserMetadata;
};
