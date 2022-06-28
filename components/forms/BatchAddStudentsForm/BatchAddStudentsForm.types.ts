/**
 * The headers used to generate the CSV Template file for students
 */
export enum HEADERS {
  PROJECT_NAME = "Project Name",
  LOA = "Level of Achievement",
  COHORT_YEAR = "Cohort Year",
  PROPOSAL_PDF = "Proposal PDF",
  NAME_ONE = "Student 1 Name",
  EMAIL_ONE = "Student 1 Email",
  NUSNET_ID_ONE = "Student 1 NUSNET ID",
  MATRICULATION_NO_ONE = "Student 1 Matriculation Number",
  NAME_TWO = "Student 2 Name",
  EMAIL_TWO = "Student 2 Email",
  NUSNET_ID_TWO = "Student 2 NUSNET ID",
  MATRICULATION_NO_TWO = "Student 2 Matriculation Number",
}

/**
 * The data type that the student CSV data will be parsed into
 */
export type StudentData = Record<HEADERS, string | number>[];
