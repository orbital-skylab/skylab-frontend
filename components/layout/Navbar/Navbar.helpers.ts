// Helpers
import { PAGES } from "@/helpers/navigation";
import { getUserRoles } from "@/helpers/roles";
// Types
import { ROLES } from "@/types/roles";
import { User } from "@/types/users";
import { NextRouter } from "next/router";
import { NavbarOption, NAVBAR_ACTIONS } from "./Navbar.types";

/**
 * Options to render in the navigation bar
 */
export const NAVBAR_OPTIONS: NavbarOption[] = [
  {
    label: "Dashboard",
    id: "nav-dashboard",
    action: NAVBAR_ACTIONS.ROUTE_TO_DASHBOARD,
    authorizedRoles: [
      ROLES.STUDENTS,
      ROLES.ADVISERS,
      ROLES.MENTORS,
      ROLES.ADMINISTRATORS,
    ],
    currentPageRegExp: /dashboard/,
  },
  {
    label: "Projects",
    id: "nav-projects",
    route: PAGES.PROJECTS,
    currentPageRegExp: /^\/projects$/,
  },
  {
    label: "Staff",
    id: "nav-staff",
    route: PAGES.STAFF,
    currentPageRegExp: /staff/,
  },
  {
    label: "Manage",
    id: "nav-manage",
    route: PAGES.MANAGE,
    authorizedRoles: [ROLES.ADMINISTRATORS],
    currentPageRegExp: /manage/,
  },
  {
    label: "Team Profile",
    id: "nav-team-profile",
    action: NAVBAR_ACTIONS.ROUTE_TO_TEAM_PROFILE,
    authorizedRoles: [ROLES.STUDENTS],
    currentPageRegExp: /projects\/[0-9]*/,
  },
  {
    label: "Profile",
    id: "nav-profile",
    action: NAVBAR_ACTIONS.ROUTE_TO_PROFILE,
    currentPageRegExp: /users\/[0-9]*/,
  },
  {
    label: "Sign Out",
    id: "nav-sign-out",
    action: NAVBAR_ACTIONS.SIGN_OUT,
    currentPageRegExp: /b$/, // Never matches anything
  },
];

/**
 * Receives objects and functions from hooks to create a function that generates the onClick handler for Navbar options
 * @param {User | undefined} user from `useAuth`
 * @param {NextRouter} router from `useRouter`
 * @param {() => void} signOut from `useAuth`
 * @returns Function that generates on click for handling Navbar
 */
export const generateOnClickGenerator = (
  user: User | undefined,
  router: NextRouter,
  signOut: () => void
) => {
  const generateOnClick = ({
    route,
    action,
  }: {
    route?: string;
    action?: string;
  }) => {
    if (route) {
      return () => {
        if (router.pathname !== route) {
          router.push(route);
        }
      };
    }

    switch (action) {
      case NAVBAR_ACTIONS.SIGN_OUT:
        return () => {
          signOut();
        };

      case NAVBAR_ACTIONS.ROUTE_TO_PROFILE:
        return () => {
          router.push(`${PAGES.USERS}/${user?.id}`);
        };

      case NAVBAR_ACTIONS.ROUTE_TO_TEAM_PROFILE:
        return () => {
          router.push(`${PAGES.PROJECTS}/${user?.student?.projectId}`);
        };

      /**
       * If you only have one role:
       *    Push you to the page of your role
       * Else:
       *    Push you to the page to show dashboards you can access
       */
      case NAVBAR_ACTIONS.ROUTE_TO_DASHBOARD:
        if (user && getUserRoles(user).length === 1) {
          const role = getUserRoles(user)[0];
          switch (role) {
            case ROLES.STUDENTS:
              return () => router.push(PAGES.DASHBOARD_STUDENT);
            case ROLES.ADVISERS:
              return () => router.push(PAGES.DASHBOARD_ADVISER);
            case ROLES.MENTORS:
              return () => router.push(PAGES.DASHBOARD_MENTOR);
            case ROLES.ADMINISTRATORS:
              return () => router.push(PAGES.DASHBOARD_ADMINISTRATOR);
            default:
              return () => router.push(PAGES.LANDING);
          }
        } else {
          return () => router.push(PAGES.DASHBOARD);
        }

      default:
        return () => alert("Invalid Navbar Action Provided");
    }
  };

  return generateOnClick;
};
