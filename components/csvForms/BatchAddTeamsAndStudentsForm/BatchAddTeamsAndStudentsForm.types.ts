import { LEVELS_OF_ACHIEVEMENT } from "@/types/teams";
import { StudentMetadata } from "@/types/students";
import { UserMetadata } from "@/types/users";

/**
 * The headers used to generate the CSV Template file for students
 */
export enum ADD_TEAMS_AND_STUDENTS_CSV_HEADERS {
  TEAM_NAME = "Team Name",
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
 * The data type that the teams and students CSV data will be parsed into
 */
export type AddTeamsAndStudentsData = Record<
  ADD_TEAMS_AND_STUDENTS_CSV_HEADERS,
  string | number
>[];

export type BatchAddTeamsAndStudentsRequestType = {
  count: number;
  teams: {
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
