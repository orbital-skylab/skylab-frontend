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
  id: string;
  route?: string;
  action?: NAVBAR_ACTIONS;
  authorizedRoles?: ROLES[];
};

export const NAVBAR_OPTIONS: NavbarOption[] = [
  {
    label: "Projects",
    id: "nav-projects",
    route: PAGES.PROJECTS,
  },
  { label: "Staff", id: "nav-staff", route: PAGES.STAFF },
  {
    label: "Manage",
    id: "nav-manage",
    route: PAGES.MANAGE,
    authorizedRoles: [ROLES.ADMINISTRATORS],
  },
  {
    label: "Profile",
    id: "nav-profile",
    route: PAGES.USERS,
  },
  {
    label: "Sign Out",
    id: "nav-sign-out",
    action: NAVBAR_ACTIONS.SIGN_OUT,
  },
];
