import { isoDateToDateTimeLocalInput } from "@/helpers/dates";
import { ERRORS } from "@/helpers/errors";
import { AddOrEditRoleFormValuesType, ROLES } from "@/types/roles";
import { User } from "@/types/users";
import * as Yup from "yup";

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
        nusnetId: user.student?.nusnetId ?? "",
        matricNo: user.student?.matricNo ?? "",
        projectId: user.student?.projectId ?? "",
      };

    case ROLES.ADVISERS:
      return {
        nusnetId: user.adviser?.nusnetId ?? "",
        matricNo: user.adviser?.matricNo ?? "",
        projectIds: user.adviser?.projectIds ?? [],
      };

    case ROLES.MENTORS:
      return {
        projectIds: user.adviser?.projectIds ?? [],
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

/**
 * Generates the validation schema for:
 * - Editing a user's role
 * @param selectedRole The selected role to being edited
 */
export const generateEditRoleValidationSchema = (
  selectedRole: ROLES | null
) => {
  return Yup.object().shape({
    nusnetId: Yup.string().when("null", {
      is: () =>
        selectedRole === ROLES.STUDENTS || selectedRole === ROLES.ADVISERS,
      then: Yup.string().required(ERRORS.REQUIRED),
    }),
    matricNo: Yup.string().when("null", {
      is: () =>
        selectedRole === ROLES.STUDENTS || selectedRole === ROLES.ADVISERS,
      then: Yup.string().required(ERRORS.REQUIRED),
    }),
    startDate: Yup.string().when("null", {
      is: () => selectedRole === ROLES.ADMINISTRATORS,
      then: Yup.string().required(ERRORS.REQUIRED),
    }),
    endDate: Yup.string().when("null", {
      is: () => selectedRole === ROLES.ADMINISTRATORS,
      then: Yup.string().required(ERRORS.REQUIRED),
    }),
  });
};
