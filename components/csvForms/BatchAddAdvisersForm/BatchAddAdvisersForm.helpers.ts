import {
  ADD_ADVISERS_CSV_HEADERS,
  AddAdvisersData,
  BatchAddAdvisersRequestType,
} from "./BatchAddAdvisersForm.types";

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
