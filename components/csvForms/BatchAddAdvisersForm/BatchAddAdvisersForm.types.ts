import { AdviserMetadata } from "@/types/advisers";
import { UserMetadata } from "@/types/users";

/**
 * The headers used to generate the CSV Template file for adding advisers
 */
export enum ADD_ADVISERS_CSV_HEADERS {
  NAME = "Name",
  EMAIL = "Email",
  COHORT_YEAR = "Cohort Year",
  NUSNET_ID = "NUSNET ID",
  MATRICULATION_NO = "Matriculation Number",
}

/**
 * The data type that the adviser CSV data will be parsed into
 */
export type AddAdvisersData = Record<
  ADD_ADVISERS_CSV_HEADERS,
  string | number
>[];

export type BatchAddAdvisersRequestType = {
  count: number;
  advisers: {
    user: Omit<UserMetadata, "id">;
    adviser: Omit<AdviserMetadata, "teamIds">;
  }[];
};
