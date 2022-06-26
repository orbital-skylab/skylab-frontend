import { HEADERS } from "./BatchAddStudentsForm.types";

export const HEADER_MAPPING: Record<string, HEADERS> = {
  name: HEADERS.PROJECT_NAME,
  achievement: HEADERS.LOA,
  cohortYear: HEADERS.COHORT_YEAR,
  proposalPdf: HEADERS.PROPOSAL_PDF,
  nameOne: HEADERS.NAME_ONE,
  emailOne: HEADERS.EMAIL_ONE,
  nusnetIdOne: HEADERS.NUSNET_ID_ONE,
  matricNoOne: HEADERS.MATRICULATION_NO_ONE,
  nameTwo: HEADERS.NAME_TWO,
  emailTwo: HEADERS.EMAIL_TWO,
  nusnetIdTwo: HEADERS.NUSNET_ID_TWO,
  matricNoTwo: HEADERS.MATRICULATION_NO_TWO,
};
