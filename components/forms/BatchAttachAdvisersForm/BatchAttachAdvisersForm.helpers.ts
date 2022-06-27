import { HEADER_MAPPING } from "./BatchAttachAdvisersForm.constants";
import { AdviserData } from "./BatchAttachAdvisersForm.types";

type BatchAttachAdviserRequestType = {
  count: number;
  nusnetIds: string[];
};

export const processBatchAdviserData = (adviserData: AdviserData) => {
  const processedValues: BatchAttachAdviserRequestType = {
    count: adviserData.length,
    nusnetIds: adviserData.map(
      (adviser) => adviser[HEADER_MAPPING.nusnetId] as string
    ),
  };

  return processedValues;
};
