import { LEVELS_OF_ACHIEVEMENT } from "@/types/teams";
import {
  BatchAddTeamsAndStudentsRequestType,
  ADD_TEAMS_AND_STUDENTS_CSV_HEADERS,
  AddTeamsAndStudentsData,
} from "./BatchAddTeamsAndStudentsForm.types";

export const processBatchStudentData = (
  teamsAndStudentsData: AddTeamsAndStudentsData
) => {
  const processedValues: BatchAddTeamsAndStudentsRequestType = {
    count: teamsAndStudentsData.length,
    teams: teamsAndStudentsData.map((team) => {
      return {
        name: team[ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.TEAM_NAME] as string,
        achievement: team[
          ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.LOA
        ] as LEVELS_OF_ACHIEVEMENT,
        cohortYear: team[
          ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR
        ] as number,
        proposalPdf: team[
          ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.PROPOSAL_PDF
        ] as string,
        students: [
          {
            user: {
              name: team[ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.NAME_ONE] as string,
              email: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.EMAIL_ONE
              ] as string,
            },
            student: {
              matricNo: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_ONE
              ] as string,
              nusnetId: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_ONE
              ] as string,
              cohortYear: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR
              ] as number,
            },
          },
          {
            user: {
              name: team[ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.NAME_TWO] as string,
              email: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.EMAIL_TWO
              ] as string,
            },
            student: {
              matricNo: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_TWO
              ] as string,
              nusnetId: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_TWO
              ] as string,
              cohortYear: team[
                ADD_TEAMS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR
              ] as number,
            },
          },
        ],
      };
    }),
  };

  return processedValues;
};
