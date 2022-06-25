import { ROLES } from "@/types/roles";
import { User } from "@/types/users";

export const toSingular = (role: ROLES) => {
  return role.slice(0, role.length - 1);
};

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
