/**
 * The headers used to generate the CSV Template file for advisers
 */
export enum HEADERS {
  NUSNET_ID = "NUSNET ID",
}

/**
 * The data type that the adviser CSV data will be parsed into
 */
export type AdviserData = Record<HEADERS, string | number>[];
