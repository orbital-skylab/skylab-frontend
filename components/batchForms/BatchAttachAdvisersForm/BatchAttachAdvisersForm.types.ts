/**
 * The headers used to generate the CSV Template file for advisers
 */
export enum ATTACH_ADVISERS_CSV_HEADERS {
  NUSNET_ID = "NUSNET ID",
}

/**
 * The data type that the adviser CSV data will be parsed into
 */
export type AttachAdvisersData = Record<
  ATTACH_ADVISERS_CSV_HEADERS,
  string | number
>[];

export type BatchAttachAdvisersRequestType = {
  count: number;
  nusnetIds: string[];
};
