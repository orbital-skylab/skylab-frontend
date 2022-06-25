import {
  AdministatorRole,
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
};

type RoleMetadata = {
  student?: StudentRole;
  adviser?: AdviserRole;
  mentor?: MentorRole;
  administrator?: AdministatorRole;
  facilitator?: FacilitatorRole;
};
