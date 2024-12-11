import {
  ADD_EXTERNAL_VOTERS_CSV_HEADERS,
  AddExternalVotersData,
  BatchAddExternalVotersRequestType,
} from "@/components/csvForms/BatchAddExternalVotersForm/BatchAddExternalVotersForm.types";
import { WithDescriptionExampleValidator } from "@/types/batchForms";
import { z } from "zod";

export const ADD_EXTERNAL_VOTERS_CSV_DESCRIPTION: WithDescriptionExampleValidator<ADD_EXTERNAL_VOTERS_CSV_HEADERS> =
  {
    [ADD_EXTERNAL_VOTERS_CSV_HEADERS.VOTER_ID]: {
      description: "The ID of the external voter.",
      example: "aBc123De45",
      validator: (val: string) => {
        const schema = z.string().min(1);
        const result = schema.safeParse(val);
        if (result.success) {
          return true;
        }

        return `${ADD_EXTERNAL_VOTERS_CSV_HEADERS.VOTER_ID} (${result.error.issues[0].message})`;
      },
    },
  };

export const processBatchAddExternalVotersData = (
  addExternalVotersData: AddExternalVotersData
): BatchAddExternalVotersRequestType => {
  return {
    voterIds: addExternalVotersData.map(
      (data) => data[ADD_EXTERNAL_VOTERS_CSV_HEADERS.VOTER_ID] as string
    ),
  };
};
