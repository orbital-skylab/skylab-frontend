import { ROLES } from "@/types/roles";
import { User } from "@/types/users";
import { userHasRole } from "./roles";

export enum PAGES {
  LANDING = "/",
  PROJECTS = "/projects",
  STAFF = "/staff",
  PROFILE = "/profile",
  EDIT_PROFILE = "/profile/edit",
  RESET_PASSWORD = "/reset-password",
  DEADLINES = "/deadlines",
  USERS = "/users",
  BATCH_ADD = "/users/batch-add",
}

export enum NAVBAR_ACTIONS {
  SIGN_OUT = "signOut",
}

export type NavbarOption = {
  label: string;
  route?: string;
  action?: NAVBAR_ACTIONS;
  checkIfVisible: (user?: User) => boolean;
};

export const NAVBAR_OPTIONS: NavbarOption[] = [
  {
    label: "Projects",
    route: PAGES.PROJECTS,
    checkIfVisible: () => true,
  },
  { label: "Staff", route: PAGES.STAFF, checkIfVisible: () => true },
  {
    label: "Manage Deadlines",
    route: PAGES.DEADLINES,
    checkIfVisible: (user?: User) =>
      !!user && userHasRole(user, ROLES.ADMINISTRATORS),
  },
  {
    label: "Manage Users",
    route: PAGES.USERS,
    checkIfVisible: (user?: User) =>
      !!user && userHasRole(user, ROLES.ADMINISTRATORS),
  },
  {
    label: "Profile",
    route: PAGES.PROFILE,
    checkIfVisible: (user?: User) => !!user,
  },
  {
    label: "Sign Out",
    action: NAVBAR_ACTIONS.SIGN_OUT,
    checkIfVisible: () => true,
  },
];
