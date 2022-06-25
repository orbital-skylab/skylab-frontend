import { ROLES } from "@/types/roles";
import { AddUserFormValuesType } from "./AddUserModal";

export const processAddUserFormValues = ({
  values,
  role,
}: {
  values: AddUserFormValuesType;
  role: ROLES;
}) => {
  const result: Record<
    string,
    Record<string, string | number | undefined>
  > = {};

  result.user = {
    name: values.name,
    email: values.email,
    password: values.password,
  };

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
