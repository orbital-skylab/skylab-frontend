import { WithDescriptionExampleValidator } from "@/types/batchForms";
import {
  ADD_ADVISERS_CSV_HEADERS,
  AddAdvisersData,
  BatchAddAdvisersRequestType,
} from "./BatchAddAdvisersForm.types";
import { z } from "zod";

export const ADD_ADVISERS_CSV_DESCRIPTION: WithDescriptionExampleValidator<ADD_ADVISERS_CSV_HEADERS> =
  {
    [ADD_ADVISERS_CSV_HEADERS.NAME]: {
      description: "The name of the adviser.",
      example: "John Doe",
      validator: (val: string) => {
        const schema = z.string();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_ADVISERS_CSV_HEADERS.NAME} (${result.error.issues[0].message})`;
      },
    },
    [ADD_ADVISERS_CSV_HEADERS.EMAIL]: {
      description: "The email of the adviser.",
      example: "e0345678@u.nus.edu",
      validator: (val: string) => {
        const schema = z.string().email();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_ADVISERS_CSV_HEADERS.EMAIL} (${result.error.issues[0].message})`;
      },
    },
    [ADD_ADVISERS_CSV_HEADERS.COHORT_YEAR]: {
      description:
        "The cohort year for the role to be created in. Must be a 4 number integer.",
      example: "2022",
      validator: (val: string) => {
        const schema = z.number().int().gte(2000).lte(3000);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_ADVISERS_CSV_HEADERS.COHORT_YEAR} (${result.error.issues[0].message})`;
      },
    },
    [ADD_ADVISERS_CSV_HEADERS.NUSNET_ID]: {
      description:
        "The NUSNET ID of the adviser. It should start with the letter E and be 8 characters long.",
      example: "E0345678",
      validator: (val: string) => {
        const schema = z.string().regex(/^(E|e)\d{7}$/);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_ADVISERS_CSV_HEADERS.NUSNET_ID} (${result.error.issues[0].message})`;
      },
    },
    [ADD_ADVISERS_CSV_HEADERS.MATRICULATION_NO]: {
      description:
        "The adviser’s Matriculation Number. It should start and end with an alphabet and be 9 characters long.",
      example: "A0123456X",
      validator: (val: string) => {
        const schema = z.string().regex(/^[A-Za-z]\d{7}[A-Za-z]$/);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_ADVISERS_CSV_HEADERS.MATRICULATION_NO} (${result.error.issues[0].message})`;
      },
    },
  };

export const processBatchAddAdvisersData = (
  addAdvisersData: AddAdvisersData
) => {
  const processedValues: BatchAddAdvisersRequestType = {
    count: addAdvisersData.length,
    advisers: addAdvisersData.map((adviserData) => {
      return {
        user: {
          name: adviserData[ADD_ADVISERS_CSV_HEADERS.NAME] as string,
          email: adviserData[ADD_ADVISERS_CSV_HEADERS.EMAIL] as string,
        },
        adviser: {
          nusnetId: adviserData[ADD_ADVISERS_CSV_HEADERS.NUSNET_ID] as string,
          matricNo: adviserData[
            ADD_ADVISERS_CSV_HEADERS.MATRICULATION_NO
          ] as string,
          cohortYear: adviserData[
            ADD_ADVISERS_CSV_HEADERS.COHORT_YEAR
          ] as number,
        },
      };
    }),
  };

  return processedValues;
};
