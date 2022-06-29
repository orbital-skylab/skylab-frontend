import {
  AttachAdvisersData,
  ATTACH_ADVISERS_CSV_HEADERS,
  BatchAttachAdvisersRequestType,
} from "./BatchAttachAdvisersForm.types";

export const processBatchAdviserData = (adviserData: AttachAdvisersData) => {
  const processedValues: BatchAttachAdvisersRequestType = {
    count: adviserData.length,
    nusnetIds: adviserData.map(
      (adviser) => adviser[ATTACH_ADVISERS_CSV_HEADERS.NUSNET_ID] as string
    ),
  };

  return processedValues;
};
