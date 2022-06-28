import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { StudentMetadata } from "@/types/students";
import { UserMetadata } from "@/types/users";
import { HEADER_MAPPING } from "./BatchAddStudentsForm.constants";
import { StudentData } from "./BatchAddStudentsForm.types";

type BatchAddStudentRequestType = {
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

export const processBatchStudentData = (studentData: StudentData) => {
  const processedValues: BatchAddStudentRequestType = {
    count: studentData.length,
    projects: studentData.map((project) => {
      return {
        name: project[HEADER_MAPPING.name] as string,
        achievement: project[
          HEADER_MAPPING.achievement
        ] as LEVELS_OF_ACHIEVEMENT,
        cohortYear: project[HEADER_MAPPING.cohortYear] as number,
        proposalPdf: project[HEADER_MAPPING.proposalPdf] as string,
        students: [
          {
            user: {
              name: project[HEADER_MAPPING.nameOne] as string,
              email: project[HEADER_MAPPING.emailOne] as string,
            },
            student: {
              matricNo: project[HEADER_MAPPING.matricNoOne] as string,
              nusnetId: project[HEADER_MAPPING.nusnetIdOne] as string,
              cohortYear: project[HEADER_MAPPING.cohortYearOne] as number,
            },
          },
          {
            user: {
              name: project[HEADER_MAPPING.nameTwo] as string,
              email: project[HEADER_MAPPING.emailTwo] as string,
            },
            student: {
              matricNo: project[HEADER_MAPPING.matricNoTwo] as string,
              nusnetId: project[HEADER_MAPPING.nusnetIdTwo] as string,
              cohortYear: project[HEADER_MAPPING.cohortYearTwo] as number,
            },
          },
        ],
      };
    }),
  };

  return processedValues;
};
