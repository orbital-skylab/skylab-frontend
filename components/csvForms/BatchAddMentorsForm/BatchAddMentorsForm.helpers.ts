import { WithDescriptionExampleValidator } from "@/types/batchForms";
import {
  ADD_MENTORS_CSV_HEADERS,
  AddMentorsData,
  BatchAddMentorsRequestType,
} from "./BatchAddMentorsForm.types";
import { z } from "zod";

export const ADD_MENTORS_CSV_DESCRIPTION: WithDescriptionExampleValidator<ADD_MENTORS_CSV_HEADERS> =
  {
    [ADD_MENTORS_CSV_HEADERS.NAME]: {
      description: "The name of the mentor.",
      example: "John Doe",
      validator: (val: string) => {
        const schema = z.string();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_MENTORS_CSV_HEADERS.NAME} (${result.error.issues[0].message})`;
      },
    },
    [ADD_MENTORS_CSV_HEADERS.EMAIL]: {
      description: "The email of the mentor.",
      example: "mentoring@gmail.com",
      validator: (val: string) => {
        const schema = z.string().email();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_MENTORS_CSV_HEADERS.EMAIL} (${result.error.issues[0].message})`;
      },
    },
    [ADD_MENTORS_CSV_HEADERS.COHORT_YEAR]: {
      description:
        "The cohort year that the mentor belongs to. Must be a 4 number integer.",
      example: "2022",
      validator: (val: string) => {
        const schema = z.number().int().gte(2000).lte(3000);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_MENTORS_CSV_HEADERS.COHORT_YEAR} (${result.error.issues[0].message})`;
      },
    },
  };

export const processBatchAddMentorsData = (addMentorsData: AddMentorsData) => {
  const processedValues: BatchAddMentorsRequestType = {
    count: addMentorsData.length,
    mentors: addMentorsData.map((mentorData) => {
      return {
        user: {
          name: mentorData[ADD_MENTORS_CSV_HEADERS.NAME] as string,
          email: mentorData[ADD_MENTORS_CSV_HEADERS.EMAIL] as string,
        },
        mentor: {
          cohortYear: mentorData[ADD_MENTORS_CSV_HEADERS.COHORT_YEAR] as number,
        },
      };
    }),
  };

  return processedValues;
};
