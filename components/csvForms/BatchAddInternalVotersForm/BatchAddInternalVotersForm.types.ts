/**
 * The headers used to generate the CSV Template file for adding internal voters
 */
export enum ADD_INTERNAL_VOTERS_CSV_HEADERS {
  EMAIL = "Email",
}

/**
 * The data type that the internal voter CSV data will be parsed into
 */
export type AddInternalVotersData = Record<
  ADD_INTERNAL_VOTERS_CSV_HEADERS,
  string | number
>[];

export type BatchAddInternalVotersRequestType = {
  emails: string[];
};
