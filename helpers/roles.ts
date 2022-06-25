import { ROLES } from "@/types/roles";
import { User } from "@/types/users";

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
export const ifUserAlreadyHasRole = (user: User, selectedRole: ROLES) => {
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
