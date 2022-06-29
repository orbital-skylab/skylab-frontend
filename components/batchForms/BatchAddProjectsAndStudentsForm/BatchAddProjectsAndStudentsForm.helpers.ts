import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import {
  BatchAddProjectsAndStudentsRequestType,
  ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS,
  AddProjectsAndStudentsData,
} from "./BatchAddProjectsAndStudentsForm.types";

export const processBatchStudentData = (
  projectsAndStudentsData: AddProjectsAndStudentsData
) => {
  const processedValues: BatchAddProjectsAndStudentsRequestType = {
    count: projectsAndStudentsData.length,
    projects: projectsAndStudentsData.map((project) => {
      return {
        name: project[
          ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.PROJECT_NAME
        ] as string,
        achievement: project[
          ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.LOA
        ] as LEVELS_OF_ACHIEVEMENT,
        cohortYear: project[
          ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR
        ] as number,
        proposalPdf: project[
          ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.PROPOSAL_PDF
        ] as string,
        students: [
          {
            user: {
              name: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NAME_ONE
              ] as string,
              email: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.EMAIL_ONE
              ] as string,
            },
            student: {
              matricNo: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_ONE
              ] as string,
              nusnetId: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_ONE
              ] as string,
              cohortYear: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR
              ] as number,
            },
          },
          {
            user: {
              name: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NAME_TWO
              ] as string,
              email: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.EMAIL_TWO
              ] as string,
            },
            student: {
              matricNo: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_TWO
              ] as string,
              nusnetId: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_TWO
              ] as string,
              cohortYear: project[
                ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR
              ] as number,
            },
          },
        ],
      };
    }),
  };

  return processedValues;
};
