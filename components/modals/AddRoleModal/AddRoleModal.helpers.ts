import { ERRORS } from "@/helpers/errors";
import { ROLES } from "@/types/roles";
import * as Yup from "yup";

/**
 * Generates the validation schema for:
 * - Adding new a role to users
 * @param selectedRole The selected role to being added
 */
export const generateAddRoleValidationSchema = (selectedRole: ROLES | null) => {
  return Yup.object().shape({
    cohortYear: Yup.number().required(ERRORS.REQUIRED),
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
