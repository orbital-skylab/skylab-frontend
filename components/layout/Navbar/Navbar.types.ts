import { ROLES } from "@/types/roles";

export enum NAVBAR_ACTIONS {
  SIGN_OUT = "signOut",
  ROUTE_TO_PROFILE = "routeToProfile",
  ROUTE_TO_TEAM_PROFILE = "routeToTeamProfile",
  ROUTE_TO_DASHBOARD = "routeToDashboard",
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
  currentPageRegExp: RegExp;
};
