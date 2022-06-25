import {
  dateTimeLocalInputToIsoDate,
  isoDateToDateTimeLocalInput,
} from "@/helpers/dates";
import { ROLES } from "@/types/roles";
import { User } from "@/types/users";
import { EditRoleFormValuesType } from "./EditRole";

export const generateInitialValues = (
  user: User,
  selectedRole: ROLES | null
): EditRoleFormValuesType => {
  if (!selectedRole) {
    return {};
  }

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
      };

    case ROLES.MENTORS:
      return {};

    case ROLES.ADMINISTRATORS:
      return {
        startDate: isoDateToDateTimeLocalInput(user.administrator?.startDate),
        endDate: isoDateToDateTimeLocalInput(user.administrator?.endDate),
      };

    default:
      return {};
  }
};

export const processValues = (
  values: EditRoleFormValuesType,
  selectedRole: ROLES | null
): Record<string, Record<string, string | number | undefined>> => {
  if (!selectedRole) {
    return {};
  }

  switch (selectedRole) {
    case ROLES.STUDENTS:
      return {
        student: {
          nusnetId: values.nusnetId,
          matricNo: values.matricNo,
          projectId: values.projectId,
        },
      };

    case ROLES.ADVISERS:
      return {
        adviser: {
          nusnetId: values.nusnetId,
          matricNo: values.matricNo,
        },
      };

    case ROLES.MENTORS:
      return {
        mentor: {},
      };

    case ROLES.ADMINISTRATORS:
      return {
        administrator: {
          startDate: dateTimeLocalInputToIsoDate(values.startDate),
          endDate: dateTimeLocalInputToIsoDate(values.endDate),
        },
      };

    default:
      return {};
  }
};
