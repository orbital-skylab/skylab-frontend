import { ROLES } from "@/types/roles";

export enum PAGES {
  LANDING = "/",
  STAFF = "/staff",
  PROJECTS = "/projects",
  USERS = "/users",
  RESET_PASSWORD = "/reset-password",
  CHANGE_PASSWORD = "/change-password",
  MANAGE = "/manage",
  MANAGE_COHORTS = "/manage/cohorts",
  MANAGE_DEADLINES = "/manage/deadlines",
  MANAGE_USERS = "/manage/users",
  MANAGE_USERS_BATCH_ADD = "/manage/users/batch-add",
  MANAGE_PROJECTS = "/manage/projects",
}

export enum NAVBAR_ACTIONS {
  SIGN_OUT = "signOut",
}

/**
 * If authorized role is not provided, then the option will be visible to all
 */
export type NavbarOption = {
  label: string;
  route?: string;
  action?: NAVBAR_ACTIONS;
  authorizedRoles?: ROLES[];
};

export const NAVBAR_OPTIONS: NavbarOption[] = [
  {
    label: "Projects",
    route: PAGES.PROJECTS,
  },
  { label: "Staff", route: PAGES.STAFF },
  {
    label: "Manage",
    route: PAGES.MANAGE,
    authorizedRoles: [ROLES.ADMINISTRATORS],
  },
  {
    label: "Profile",
    route: PAGES.USERS,
  },
  {
    label: "Sign Out",
    action: NAVBAR_ACTIONS.SIGN_OUT,
  },
];
