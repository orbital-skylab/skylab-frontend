import { AdministratorMetadata } from "./administrators";
import { AdviserMetadata } from "./advisers";
import { FacilitatorMetadata } from "./facilitators";
import { MentorMetadata } from "./mentors";
import { StudentMetadata } from "./students";

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

export type User = UserMetadata & RoleMetadata;

type RoleMetadata = {
  student?: StudentRole;
  adviser?: AdviserRole;
  mentor?: MentorRole;
  administrator?: AdministatorRole;
  facilitator?: FacilitatorRole;
};

type WithRoleSpecificId<T> = T & { id: number };
type StudentRole = WithRoleSpecificId<StudentMetadata>;
type AdviserRole = WithRoleSpecificId<AdviserMetadata>;
type MentorRole = WithRoleSpecificId<MentorMetadata>;
type AdministatorRole = WithRoleSpecificId<AdministratorMetadata>;
type FacilitatorRole = WithRoleSpecificId<FacilitatorMetadata>;
