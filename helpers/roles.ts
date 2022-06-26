import {
  AddOrEditRoleFormValuesType,
  AddUserFormValuesType,
  ROLES,
} from "@/types/roles";
import { User } from "@/types/users";
import { dateTimeLocalInputToIsoDate } from "@/helpers/dates";
import { isAddUserFormValuesType } from "./types";

/**
 * Changes a role string to be singular
 * @param {ROLES} role The specified role
 * @returns {string}
 */
export const toSingular = (role: ROLES | null) => {
  if (!role) {
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
export const userHasRole = (user: User, selectedRole: ROLES) => {
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
export const getUserRoles = (user: User) => {
  return Object.values(ROLES).filter((role) => userHasRole(user, role));
};

/**
 * Retrieves the specified role ID of a user
 * Eg. getRoleId(user, "Students") === user.student.id
 * @param user The User object to retrieve the ID from
 * @param selectedRole The role to retrieve
 * @returns {number} The roleId
 */
export const getRoleId = (user: User, selectedRole: ROLES | null) => {
  if (!selectedRole) {
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
export const generateEmptyInitialValues = (
  currentCohortYear: number | undefined
): AddUserFormValuesType => {
  return {
    name: "",
    email: "",
    password: "",
    cohortYear: currentCohortYear,
    nusnetId: "",
    matricNo: "",
    projectId: -1,
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
        password: values.password,
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
          matricNo: values.matricNo,
          nusnetId: values.nusnetId,
          projectId: values.projectId,
          ...cohortYear,
        },
      };

    case ROLES.ADVISERS:
      return {
        ...user,
        adviser: {
          matricNo: values.matricNo,
          nusnetId: values.nusnetId,
          projectIds: values.projectIds,
          ...cohortYear,
        },
      };

    case ROLES.MENTORS:
      return {
        ...user,
        mentor: {
          projectIds: values.projectIds,
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
