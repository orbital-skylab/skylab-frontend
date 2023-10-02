import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import {
  BatchAddProjectsAndStudentsRequestType,
  ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS,
  AddProjectsAndStudentsData,
} from "./BatchAddProjectsAndStudentsForm.types";
import { z } from "zod";
import { WithDescriptionExampleValidator } from "@/types/batchForms";

export const ADD_PROJECTS_AND_STUDENTS_CSV_DESCRIPTION: WithDescriptionExampleValidator<ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS> =
  {
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.PROJECT_NAME]: {
      description: "The name of the project.",
      example: "CCSGP Volunteer Job Board",
      validator: (val: string) => {
        const schema = z.string();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.PROJECT_NAME} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.TEAM_NAME]: {
      description: "The name of the team.",
      example: "NUSGrabYourOwnFood",
      validator: (val: string) => {
        const schema = z.string();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.TEAM_NAME} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.LOA]: {
      description:
        "The team’s initial Level of Achievement. Must be one of ‘Vostok’ | ‘Gemini’ | ‘Apollo’ | ‘Artemis’.",
      example: "Artemis",
      validator: (val: string) => {
        const schema = z.nativeEnum(LEVELS_OF_ACHIEVEMENT);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.LOA} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR]: {
      description:
        "The cohort year that the team belongs to. Must be a 4 number integer.",
      example: "2022",
      validator: (val: string) => {
        const schema = z.number().int().gte(2000).lte(3000);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.COHORT_YEAR} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.PROPOSAL_PDF]: {
      description:
        "A link to the team’s proposal PDF. Should be a link to the PDF file.",
      example: "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j.pdf",
      validator: (val: string) => {
        const schema = z.string().url();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.PROPOSAL_PDF} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NAME_ONE]: {
      description: "The first student’s full name.",
      example: "Rayner Loh",
      validator: (val: string) => {
        const schema = z.string();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NAME_ONE} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.EMAIL_ONE]: {
      description: "The first student’s school email.",
      example: "e0123456@u.nus.edu",
      validator: (val: string) => {
        const schema = z.string().email();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.EMAIL_ONE} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_ONE]: {
      description:
        "The first student’s NUSNET ID. It should start with the letter E and be 8 characters long.",
      example: "E0123456",
      validator: (val: string) => {
        const schema = z.string().regex(/^(E|e)\d{7}$/);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_ONE} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_ONE]: {
      description:
        "The first student’s Matriculation Number. It should start and end with an alphabet and be 9 characters long.",
      example: "A0123456X",
      validator: (val: string) => {
        const schema = z.string().regex(/^[A-Za-z]\d{7}[A-Za-z]$/);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_ONE} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NAME_TWO]: {
      description: "The second student’s full name.",
      example: "Vijay Narayanan",
      validator: (val: string) => {
        const schema = z.string();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NAME_TWO} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.EMAIL_TWO]: {
      description: "The second student’s school email.",
      example: "e0234567@u.nus.edu",
      validator: (val: string) => {
        const schema = z.string().email();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.EMAIL_TWO} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_TWO]: {
      description:
        "The second student’s NUSNET ID. It should start with the letter E and be 8 characters long.",
      example: "E0234567",
      validator: (val: string) => {
        const schema = z.string().regex(/^(E|e)\d{7}$/);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.NUSNET_ID_TWO} (${result.error.issues[0].message})`;
      },
    },
    [ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_TWO]: {
      description:
        "The second student’s Matriculation Number. It should start and end with an alphabet and be 9 characters long.",
      example: "A0234567X",
      validator: (val: string) => {
        const schema = z.string().regex(/^[A-Za-z]\d{7}[A-Za-z]$/);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.MATRICULATION_NO_TWO} (${result.error.issues[0].message})`;
      },
    },
  };

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
        teamName: project[
          ADD_PROJECTS_AND_STUDENTS_CSV_HEADERS.TEAM_NAME
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
