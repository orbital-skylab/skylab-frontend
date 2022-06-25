import { AddUserFormValuesType } from "@/components/modals/AddUserModal/AddUserModal";
import { ROLES } from "@/types/roles";

export const toSingular = (role: ROLES) => {
  return role.slice(0, role.length - 1);
};

export const processUserFormValues = ({
  values,
  role,
  withUser = false,
}: {
  values: AddUserFormValuesType;
  role: ROLES;
  withUser?: boolean;
}) => {
  const result: Record<
    string,
    Record<string, string | number | undefined>
  > = {};

  if (withUser) {
    result.user = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
  }

  switch (role) {
    case ROLES.STUDENTS:
      result.student = {
        matricNo: values.matricNo,
        nusnetId: values.nusnetId,
        projectId: values.projectId,
        cohortYear: values.cohortYear,
      };
      break;

    case ROLES.ADVISERS:
      result.adviser = {
        matricNo: values.matricNo,
        nusnetId: values.nusnetId,
        cohortYear: values.cohortYear,
      };
      break;

    case ROLES.MENTORS:
      result.mentor = {
        cohortYear: values.cohortYear,
      };
      break;

    default:
      break;
  }

  return result;
};
