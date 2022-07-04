import { ROLES } from "@/types/roles";

export enum PAGES {
  LANDING = "/",
  PROJECTS = "/projects",
  STAFF = "/staff",
  PROFILE = "/profile",
  RESET_PASSWORD = "/reset-password",
  DEADLINES = "/deadlines",
  USERS = "/users",
  BATCH_ADD = "/users/batch-add",
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
    label: "Manage Deadlines",
    route: PAGES.DEADLINES,
    authorizedRoles: [ROLES.ADMINISTRATORS],
  },
  {
    label: "Manage Users",
    route: PAGES.USERS,
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
