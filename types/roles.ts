import { AdministratorMetadata } from "./administrators";
import { AdviserMetadata } from "./advisers";
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

type WithId<T> = T & { id: number };
export type StudentRole = WithId<StudentMetadata>;
export type AdviserRole = WithId<AdviserMetadata>;
export type MentorRole = WithId<MentorMetadata>;
export type AdministratorRole = WithId<AdministratorMetadata>;

/**
 * General user data for the following components
 * 1. `components/modal/AddUserModal`
 */
export type AddUserFormValuesType = Omit<UserMetadata, "id"> &
  AddOrEditRoleFormValuesType;

/**
 * General role data for the following components
 * 1. `components/modals/AddRoleModal`
 * 2. `components/modals/ViewRoleModal/EditRole`
 */
export type AddOrEditRoleFormValuesType = Partial<
  Omit<StudentMetadata, "projectId"> & { projectId: number | "" }
> &
  Partial<AdviserMetadata> &
  Partial<MentorMetadata> &
  Partial<AdministratorMetadata>;
