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
    action: NAVBAR_ACTIONS.ROUTE_TO_DASHBOARD,
    authorizedRoles: [
      ROLES.STUDENTS,
      ROLES.ADVISERS,
      ROLES.MENTORS,
      ROLES.ADMINISTRATORS,
    ],
  },
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

/**
 * Receives router object to generate function to check if the current page is under a provided path
 * @param {NextRouter} router from `useRouter`
 * @returns {(path: string | undefined) => boolean}
 */
export const generateIsCurrentPage = (router: NextRouter) => {
  const isCurrentPage = (path: string | undefined) => {
    if (path === undefined) {
      return false;
    } else if (path.split("/").length < 2) {
      return false;
    }
    return (
      router.asPath.split("/")[1].toLowerCase() ===
      path.split("/")[1].toLowerCase()
    );
  };
  return isCurrentPage;
};

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
