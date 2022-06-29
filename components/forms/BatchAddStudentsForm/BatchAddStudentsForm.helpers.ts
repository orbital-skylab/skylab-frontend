import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import {
  BatchAddStudentRequestType,
  HEADERS,
  StudentData,
} from "./BatchAddStudentsForm.types";

export const processBatchStudentData = (studentData: StudentData) => {
  const processedValues: BatchAddStudentRequestType = {
    count: studentData.length,
    projects: studentData.map((project) => {
      return {
        name: project[HEADERS.PROJECT_NAME] as string,
        achievement: project[HEADERS.LOA] as LEVELS_OF_ACHIEVEMENT,
        cohortYear: project[HEADERS.COHORT_YEAR] as number,
        proposalPdf: project[HEADERS.PROPOSAL_PDF] as string,
        students: [
          {
            user: {
              name: project[HEADERS.NAME_ONE] as string,
              email: project[HEADERS.EMAIL_ONE] as string,
            },
            student: {
              matricNo: project[HEADERS.MATRICULATION_NO_ONE] as string,
              nusnetId: project[HEADERS.NUSNET_ID_ONE] as string,
              cohortYear: project[HEADERS.COHORT_YEAR] as number,
            },
          },
          {
            user: {
              name: project[HEADERS.NAME_TWO] as string,
              email: project[HEADERS.EMAIL_TWO] as string,
            },
            student: {
              matricNo: project[HEADERS.MATRICULATION_NO_TWO] as string,
              nusnetId: project[HEADERS.NUSNET_ID_TWO] as string,
              cohortYear: project[HEADERS.COHORT_YEAR] as number,
            },
          },
        ],
      };
    }),
  };

  return processedValues;
};

export const checkHeadersMatch = (studentData: unknown[]) => {
  if (!studentData.length || typeof studentData[0] !== "object") {
    return false;
  }

  const actualHeaders = Object.values(HEADERS);
  const detectedHeaders = Object.keys(
    studentData[0] as Record<string, unknown>
  );

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
