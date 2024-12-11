import {
  ADD_INTERNAL_VOTERS_CSV_HEADERS,
  AddInternalVotersData,
  BatchAddInternalVotersRequestType,
} from "@/components/csvForms/BatchAddInternalVotersForm/BatchAddInternalVotersForm.types";
import { WithDescriptionExampleValidator } from "@/types/batchForms";
import { z } from "zod";

export const ADD_INTERNAL_VOTERS_CSV_DESCRIPTION: WithDescriptionExampleValidator<ADD_INTERNAL_VOTERS_CSV_HEADERS> =
  {
    [ADD_INTERNAL_VOTERS_CSV_HEADERS.EMAIL]: {
      description: "The email of the internal voter.",
      example: "e1111111A@u.nus.edu",
      validator: (val: string) => {
        const schema = z.string().email();
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_INTERNAL_VOTERS_CSV_HEADERS.EMAIL} (${result.error.issues[0].message})`;
      },
    },
  };

export const processBatchAddInternalVotersData = (
  addInternalVotersData: AddInternalVotersData
): BatchAddInternalVotersRequestType => {
  return {
    emails: addInternalVotersData.map(
      (data) => data[ADD_INTERNAL_VOTERS_CSV_HEADERS.EMAIL] as string
    ),
  };
};
