import {
  AdviserData,
  ATTACH_ADVISER_CSV_HEADERS,
  BatchAttachAdviserRequestType,
} from "./BatchAttachAdvisersForm.types";

export const processBatchAdviserData = (adviserData: AdviserData) => {
  const processedValues: BatchAttachAdviserRequestType = {
    count: adviserData.length,
    nusnetIds: adviserData.map(
      (adviser) => adviser[ATTACH_ADVISER_CSV_HEADERS.NUSNET_ID] as string
    ),
  };

  return processedValues;
};
