import { ROLES } from "@/types/roles";
import { AddRoleFormValuesType } from "./AddRoleModal";

export const processAddRoleFormValues = ({
  values,
  role,
}: {
  values: AddRoleFormValuesType;
  role: ROLES;
}) => {
  const result: Record<
    string,
    Record<string, string | number | undefined>
  > = {};

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
