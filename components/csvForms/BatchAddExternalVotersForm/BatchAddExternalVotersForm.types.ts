/**
 * The headers used to generate the CSV Template file for adding external voters
 */
export enum ADD_EXTERNAL_VOTERS_CSV_HEADERS {
  VOTER_ID = "Voter ID",
}

/**
 * The data type that the external voter CSV data will be parsed into
 */
export type AddExternalVotersData = Record<
  ADD_EXTERNAL_VOTERS_CSV_HEADERS,
  string | number
>[];

export type BatchAddExternalVotersRequestType = {
  voterIds: string[];
};
