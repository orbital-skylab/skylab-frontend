import { AdministratorMetadata } from "./administrators";
import { AdviserMetadata } from "./advisers";
import { MentorMetadata } from "./mentors";
import { StudentMetadata } from "./students";
import { UserMetadata } from "./users";

// export type ROLES = Exclude<ROLES_WITH_ALL, typeof ROLES_WITH_ALL.ALL>;

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
type WithUserId<T> = T & { userId: number };
export type StudentRole = WithUserId<WithId<StudentMetadata>>;
export type AdviserRole = WithUserId<WithId<AdviserMetadata>>;
export type MentorRole = WithUserId<WithId<MentorMetadata>>;
export type AdministratorRole = WithUserId<WithId<AdministratorMetadata>>;

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
  Omit<StudentMetadata, "teamId"> & { teamId: number | "" }
> &
  Partial<AdviserMetadata> &
  Partial<MentorMetadata> &
  Partial<AdministratorMetadata>;
