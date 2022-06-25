import { AdministratorMetadata } from "./administrators";
import { AdviserMetadata } from "./advisers";
import { FacilitatorMetadata } from "./facilitators";
import { MentorMetadata } from "./mentors";
import { StudentMetadata } from "./students";

export enum ROLES {
  STUDENTS = "Students",
  ADVISERS = "Advisers",
  MENTORS = "Mentors",
  ADMINISTRATORS = "Administrators",
}

export enum ROLES_WITH_ALL {
  ALL = "All",
  STUDENTS = "Students",
  ADVISERS = "Advisers",
  MENTORS = "Mentors",
  ADMINISTRATORS = "Administrators",
}

type WithRoleSpecificId<T> = T & { id: number };
export type StudentRole = WithRoleSpecificId<StudentMetadata>;
export type AdviserRole = WithRoleSpecificId<AdviserMetadata>;
export type MentorRole = WithRoleSpecificId<MentorMetadata>;
export type AdministratorRole = WithRoleSpecificId<AdministratorMetadata>;
export type FacilitatorRole = WithRoleSpecificId<FacilitatorMetadata>;
