import {
  AddOrEditRoleFormValuesType,
  AddUserFormValuesType,
  ROLES,
  ROLES_WITH_ALL,
} from "@/types/roles";
import { User } from "@/types/users";
import { dateTimeLocalInputToIsoDate } from "@/helpers/dates";
import { isAddUserFormValuesType } from "./types";
import { stripEmptyStrings } from "./forms";
import { Project } from "@/types/projects";

/**
 * Changes a role string to be singular
 * @param {ROLES} role The specified role
 * @returns {string}
 */
export const toSingular = (role: ROLES | ROLES_WITH_ALL | null | undefined) => {
  if (!role) {
    return "";
  } else if (role === ROLES_WITH_ALL.ALL) {
    return "";
  }

  return role.slice(0, role.length - 1);
};

/**
 * Checks if a specified user has a specified role
 * @param user The User object to check
 * @param selectedRole The role to check
 * @returns {boolean}
 */
export const userHasRole = (
  user: User | undefined,
  selectedRole: ROLES | ROLES[]
): boolean => {
  if (!user) {
    return false;
  }

  if (Array.isArray(selectedRole)) {
    return Boolean(
      selectedRole.reduce((acc, role) => acc || userHasRole(user, role), false)
    );
  }

  if (selectedRole === ROLES.STUDENTS && user.student && user.student.id) {
    return true;
  } else if (
    selectedRole === ROLES.ADVISERS &&
    user.adviser &&
    user.adviser.id
  ) {
    return true;
  } else if (selectedRole === ROLES.MENTORS && user.mentor && user.mentor.id) {
    return true;
  } else if (
    selectedRole === ROLES.ADMINISTRATORS &&
    user.administrator &&
    user.administrator.id
  ) {
    return true;
  }

  return false;
};

/**
 * Gets an array of roles that a user has
 */
export const getUserRoles = (user: User | undefined) => {
  if (!user) {
    return [];
  }

  return Object.values(ROLES).filter((role) => userHasRole(user, role));
};

/**
 * Gets the most important role of a user
 * @param user The User object to check
 * @returns {ROLES | ""} The most important role
 */
export const getMostImportantRole = (user: User | undefined) => {
  if (!user) {
    return "";
  }

  if (userHasRole(user, ROLES.ADMINISTRATORS)) {
    return ROLES.ADMINISTRATORS;
  } else if (userHasRole(user, ROLES.MENTORS)) {
    return ROLES.MENTORS;
  } else if (userHasRole(user, ROLES.ADVISERS)) {
    return ROLES.ADVISERS;
  } else if (userHasRole(user, ROLES.STUDENTS)) {
    return ROLES.STUDENTS;
  }

  return "";
};

/**
 * Retrieves the specified role ID of a user
 * Eg. getRoleId(user, "Students") === user.student.id
 * @param user The User object to retrieve the ID from
 * @param selectedRole The role to retrieve
 * @returns {number} The roleId
 */
export const getRoleId = (
  user: User | null | undefined,
  selectedRole: ROLES | null
) => {
  if (!selectedRole || !user) {
    return -1;
  }

  switch (selectedRole) {
    case ROLES.STUDENTS:
      return user.student?.id ?? -1;
    case ROLES.ADVISERS:
      return user.adviser?.id ?? -1;
    case ROLES.MENTORS:
      return user.mentor?.id ?? -1;
    case ROLES.ADMINISTRATORS:
      return user.administrator?.id ?? -1;
  }
};

/**
 * To generate empty intial values for Formik for the following components
 * 1. `/components/modals/AddUserModal`
 * 2. `/components/modals/AddRoleModal`
 */
export const generateAddUserOrRoleEmptyInitialValues = (
  currentCohortYear: number | undefined,
  user?: User
): AddUserFormValuesType => {
  return {
    name: "",
    email: "",
    cohortYear: currentCohortYear,
    nusnetId: user?.student?.nusnetId ?? user?.adviser?.nusnetId ?? "",
    matricNo: user?.student?.matricNo ?? user?.adviser?.matricNo ?? "",
    projectId: "",
    projectIds: [],
    startDate: "",
    endDate: "",
  };
};

/**
 * To process form values in the format to submit for the following components
 * 1. `/components/modals/AddUserModal`
 * 2. `/components/modals/AddRoleModal`
 * 3. `/components/modals/ViewRole/EditRoleModal`
 * // TODO: Write unit tests
 * @param param0.values The values of the submitted form
 * @returns
 */
export const processAddUserOrRoleFormValues = ({
  values,
  selectedRole,
  includeUserData,
  includeCohortYear,
}: {
  values: AddUserFormValuesType | AddOrEditRoleFormValuesType;
  selectedRole: ROLES | null;
  includeUserData?: boolean;
  includeCohortYear?: boolean;
}): Record<string, Record<string, string | number | number[] | undefined>> => {
  let user = {};
  if (includeUserData && isAddUserFormValuesType(values)) {
    user = {
      user: {
        name: values.name,
        email: values.email,
      },
    };
  }

  let cohortYear = {};
  if (includeCohortYear) {
    cohortYear = { cohortYear: values.cohortYear };
  }

  switch (selectedRole) {
    case ROLES.STUDENTS:
      return {
        ...user,
        student: {
          ...stripEmptyStrings({
            matricNo: values.matricNo,
            nusnetId: values.nusnetId,
            projectId: values.projectId,
          }),
          ...cohortYear,
        },
      };

    case ROLES.ADVISERS:
      return {
        ...user,
        adviser: {
          ...stripEmptyStrings({
            matricNo: values.matricNo,
            nusnetId: values.nusnetId,
          }),
          ...(values.projectIds && values.projectIds.length
            ? { projectIds: values.projectIds }
            : undefined),
          ...cohortYear,
        },
      };

    case ROLES.MENTORS:
      return {
        ...user,
        mentor: {
          ...(values.projectIds && values.projectIds.length
            ? { projectIds: values.projectIds }
            : undefined),
          ...cohortYear,
        },
      };

    case ROLES.ADMINISTRATORS:
      return {
        ...user,
        administrator: {
          startDate: dateTimeLocalInputToIsoDate(values.startDate),
          endDate: dateTimeLocalInputToIsoDate(values.endDate),
        },
      };

    default:
      return {};
  }
};

/**
 * Check if a user is a project's adviser
 * @returns {boolean}
 */
export const checkIfProjectsAdviser = (
  project: Project | undefined,
  user: User | undefined
) => {
  return (
    user &&
    user.adviser &&
    project &&
    project.adviser &&
    user.adviser.id === project.adviser.adviserId
  );
};
