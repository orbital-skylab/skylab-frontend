import { AdministratorMetadata } from "./administrators";
import { AdviserMetadata } from "./advisers";
import { FacilitatorMetadata } from "./facilitators";
import { MentorMetadata } from "./mentors";
import { StudentMetadata } from "./students";
import { UserMetadata } from "./users";

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

/**
 * General user data for the following components
 * 1. `components/modal/AddUserModal`
 */
export type AddUserFormValuesType = Omit<UserMetadata, "id"> & {
  password?: string;
} & AddOrEditRoleFormValuesType;

/**
 * General role data for the following components
 * 1. `components/modals/AddRoleModal`
 * 2. `components/modals/ViewRoleModal/EditRole`
 */
export type AddOrEditRoleFormValuesType = Partial<StudentMetadata> &
  Partial<AdviserMetadata> &
  Partial<MentorMetadata> &
  Partial<AdministratorMetadata>;
