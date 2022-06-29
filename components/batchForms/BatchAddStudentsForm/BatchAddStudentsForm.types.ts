import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { StudentMetadata } from "@/types/students";
import { UserMetadata } from "@/types/users";

/**
 * The headers used to generate the CSV Template file for students
 */
export enum ADD_STUDENT_CSV_HEADERS {
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
export type StudentData = Record<ADD_STUDENT_CSV_HEADERS, string | number>[];

export type BatchAddStudentRequestType = {
  count: number;
  projects: {
    name: string;
    achievement: LEVELS_OF_ACHIEVEMENT;
    cohortYear: number;
    proposalPdf: string;
    students: {
      user: Omit<UserMetadata, "id">;
      student: Partial<StudentMetadata>;
    }[];
  }[];
};
