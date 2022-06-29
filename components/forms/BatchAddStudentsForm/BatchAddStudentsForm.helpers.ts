import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import {
  BatchAddStudentRequestType,
  ADD_STUDENT_CSV_HEADERS,
  StudentData,
} from "./BatchAddStudentsForm.types";

export const processBatchStudentData = (studentData: StudentData) => {
  const processedValues: BatchAddStudentRequestType = {
    count: studentData.length,
    projects: studentData.map((project) => {
      return {
        name: project[ADD_STUDENT_CSV_HEADERS.PROJECT_NAME] as string,
        achievement: project[
          ADD_STUDENT_CSV_HEADERS.LOA
        ] as LEVELS_OF_ACHIEVEMENT,
        cohortYear: project[ADD_STUDENT_CSV_HEADERS.COHORT_YEAR] as number,
        proposalPdf: project[ADD_STUDENT_CSV_HEADERS.PROPOSAL_PDF] as string,
        students: [
          {
            user: {
              name: project[ADD_STUDENT_CSV_HEADERS.NAME_ONE] as string,
              email: project[ADD_STUDENT_CSV_HEADERS.EMAIL_ONE] as string,
            },
            student: {
              matricNo: project[
                ADD_STUDENT_CSV_HEADERS.MATRICULATION_NO_ONE
              ] as string,
              nusnetId: project[
                ADD_STUDENT_CSV_HEADERS.NUSNET_ID_ONE
              ] as string,
              cohortYear: project[
                ADD_STUDENT_CSV_HEADERS.COHORT_YEAR
              ] as number,
            },
          },
          {
            user: {
              name: project[ADD_STUDENT_CSV_HEADERS.NAME_TWO] as string,
              email: project[ADD_STUDENT_CSV_HEADERS.EMAIL_TWO] as string,
            },
            student: {
              matricNo: project[
                ADD_STUDENT_CSV_HEADERS.MATRICULATION_NO_TWO
              ] as string,
              nusnetId: project[
                ADD_STUDENT_CSV_HEADERS.NUSNET_ID_TWO
              ] as string,
              cohortYear: project[
                ADD_STUDENT_CSV_HEADERS.COHORT_YEAR
              ] as number,
            },
          },
        ],
      };
    }),
  };

  return processedValues;
};

export const checkHeadersMatch = (
  parsedData: unknown[],
  actualHeaders: string[]
) => {
  if (!parsedData.length || typeof parsedData[0] !== "object") {
    return false;
  }

  const detectedHeaders = Object.keys(parsedData[0] as Record<string, unknown>);

  if (actualHeaders.length !== detectedHeaders.length) {
    return false;
  }

  const set = new Set(detectedHeaders);
  actualHeaders.forEach((header) => {
    if (!set.has(header)) {
      return false;
    }
  });

  return true;
};
