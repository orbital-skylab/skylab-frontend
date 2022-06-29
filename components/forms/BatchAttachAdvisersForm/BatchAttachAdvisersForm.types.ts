/**
 * The headers used to generate the CSV Template file for advisers
 */
export enum ATTACH_ADVISER_CSV_HEADERS {
  NUSNET_ID = "NUSNET ID",
}

/**
 * The data type that the adviser CSV data will be parsed into
 */
export type AdviserData = Record<ATTACH_ADVISER_CSV_HEADERS, string | number>[];

export type BatchAttachAdviserRequestType = {
  count: number;
  nusnetIds: string[];
};
