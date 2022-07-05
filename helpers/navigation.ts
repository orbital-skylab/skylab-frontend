import { ROLES } from "@/types/roles";

export enum PAGES {
  LANDING = "/",
  PROJECTS = "/projects",
  STAFF = "/staff",
  PROFILE = "/profile",
  RESET_PASSWORD = "/reset-password",
  MANAGE = "/manage",
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
    label: "Gallery",
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
    route: PAGES.PROFILE,
  },
  {
    label: "Sign Out",
    action: NAVBAR_ACTIONS.SIGN_OUT,
  },
];
