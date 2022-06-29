import {
  AdviserData,
  BatchAttachAdviserRequestType,
  HEADERS,
} from "./BatchAttachAdvisersForm.types";

export const processBatchAdviserData = (adviserData: AdviserData) => {
  const processedValues: BatchAttachAdviserRequestType = {
    count: adviserData.length,
    nusnetIds: adviserData.map(
      (adviser) => adviser[HEADERS.NUSNET_ID] as string
    ),
  };

  return processedValues;
};
