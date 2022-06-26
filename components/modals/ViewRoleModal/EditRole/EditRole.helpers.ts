import { isoDateToDateTimeLocalInput } from "@/helpers/dates";
import { AddOrEditRoleFormValuesType, ROLES } from "@/types/roles";
import { User } from "@/types/users";

/**
 * Generate initial form values for Formik by using user's pre-existing data
 */
export const generateInitialValues = ({
  user,
  selectedRole,
}: {
  user: User;
  selectedRole: ROLES | null;
}): AddOrEditRoleFormValuesType => {
  switch (selectedRole) {
    case ROLES.STUDENTS:
      return {
        nusnetId: user.student?.nusnetId,
        matricNo: user.student?.matricNo,
        projectId: user.student?.projectId,
      };

    case ROLES.ADVISERS:
      return {
        nusnetId: user.adviser?.nusnetId,
        matricNo: user.adviser?.matricNo,
        projectIds: user.adviser?.projectIds,
      };

    case ROLES.MENTORS:
      return {
        projectIds: user.adviser?.projectIds,
      };

    case ROLES.ADMINISTRATORS:
      return {
        startDate: isoDateToDateTimeLocalInput(user.administrator?.startDate),
        endDate: isoDateToDateTimeLocalInput(user.administrator?.endDate),
      };

    default:
      return {};
  }
};
